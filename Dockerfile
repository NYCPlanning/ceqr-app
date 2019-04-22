FROM ruby:2.6

RUN apt-get update -qq && apt-get install -qq \
    apt-transport-https \
    postgresql \
    && curl -sL https://deb.nodesource.com/setup_10.x | bash - \
    && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && apt-get update && apt-get install -qq \
    nodejs \
    yarn \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir /yarn
ADD ./frontend/package.json /yarn
RUN cd /yarn && yarn

RUN mkdir /app
WORKDIR /app

ADD Gemfile Gemfile.lock ./
RUN gem install bundler && bundle install

EXPOSE 3000

ENTRYPOINT ["bundle", "exec"]
CMD [ "rails", "server", "-b", "0.0.0.0"]
