module Auth
  module V1
    class UsersController < AuthController
      def create
        if EmailWhitelist.on(user_params['email'])
          params = user_params.merge({
            account_approved: true
          })

          user = User.create!(params)

          token = JsonWebToken.encode({ action: 'validate', email: user.email })
          UserMailer.with(user: user, token: token, base_url: get_base_url_from_referer(request)).account_activation.deliver_later

          response = { message: Message.account_created }
          json_response(response, :created)
        else
          user = User.create!(user_params)

          UserMailer.with(user: user).account_in_review.deliver_later
          
          token = JsonWebToken.encode({ action: 'approve', email: user.email })
          AdminMailer.with(user: user, token: token, base_url: get_base_url_from_referer(request)).account_in_review.deliver_later

          response = { message: Message.account_in_review }
          json_response(response, :accepted)
        end
      end

      def validate
        token = JsonWebToken.decode(validate_params['token'])

        unless token['action'] == 'validate'
          raise ActionController::ParameterMissing, 'Incorrect action'
        end

        User.find_by(email: token['email']).update!(email_validated: true)

        response = { message: Message.account_validated }
        json_response(response, :ok)
      end

      def request_new_password
        user = User.find_by(email: password_reset_params['email'])

        token = JsonWebToken.encode({ action: 'password_reset', email: user.email })
        UserMailer.with(user: user, token: token, base_url: get_base_url_from_referer(request)).password_reset.deliver_later

        response = { message: Message.password_reset_sent }
        json_response(response, :ok)
      end

      def update_password
        token = JsonWebToken.decode(password_reset_params['token'])

        unless token['action'] == 'password_reset'
          raise ActionController::ParameterMissing, 'Incorrect action'
        end

        user = User.find_by(email: token['email'])
        user.password = user.password_confirmation = password_reset_params['password']
        user.save!

        response = { message: Message.password_reset }
        json_response(response, :ok)
      end

      def approve
        token = JsonWebToken.decode(approve_params['token'])

        unless token['action'] == 'approve'
          raise ActionController::ParameterMissing, 'Incorrect action'
        end

        user = User.find_by(email: token['email'])
        user.update!(email_validated: true, account_approved: true)

        UserMailer.with(user: user).account_approved.deliver_later

        response = { message: Message.account_approved, email: token['email'] }
        json_response(response, :ok)
      end

      private

      def approve_params
        params.permit(
          :token
        )
      end

      def password_reset_params
        params.permit(
          :token,
          :email,
          :password
        )
      end

      def validate_params
        params.permit(
          :token
        )
      end

      def user_params
        params.require(:user).permit(
          :email,
          :password
        )
      end

      def get_port_string(port)
        (port && port != 80 && port != 443) ? (':' + port.to_s) : ''
      end

      # Create base_url for account validation from HTTP_REFERER header:
      def get_base_url_from_referer(request)
          # Parse URI from header
          http_referer_header = request.headers["HTTP_REFERER"]
          referer = URI.parse(http_referer_header) if http_referer_header
          # Recompose without path
          (referer && referer.scheme && referer.host) \
          ? "#{referer.scheme}://#{referer.host}#{get_port_string(referer.port)}"
          : "https://#{Rails.application.config.action_mailer.default_url_options[:host]}"
      end
    end
  end
end
