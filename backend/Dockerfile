FROM ruby:2.7.7

RUN rvm --default use $RUBY_VERSION

RUN apt-get update -qq && apt-get install -qq \
    postgresql

RUN mkdir /app
WORKDIR /app

ADD Gemfile Gemfile.lock ./
RUN gem install bundler && bundle install

EXPOSE 3000

ENTRYPOINT ["bundle", "exec"]
CMD [ "rails", "server", "-b", "0.0.0.0"]
