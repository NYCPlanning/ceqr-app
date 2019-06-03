require 'rails_helper'

RSpec.describe Auth::V1::UsersController do

  default_base_url = 'https://test'

  it "should return default if HTTP_REFERER header is missing" do
    expect(controller.send(:get_base_url_from_referer, controller.request)).to eq(default_base_url)
  end

  it "should return default if HTTP_REFERER is not a URI with scheme and host" do
    controller.request.headers['HTTP_REFERER'] = 'failure'
    expect(controller.send(:get_base_url_from_referer, controller.request)).to eq(default_base_url)
  end

  it "should return HTTP_REFERER URI with port without path" do
    controller.request.headers['HTTP_REFERER'] = 'https://host:3000/path1/path2/'
    expect(controller.send(:get_base_url_from_referer, controller.request)).to eq('https://host:3000')
  end

  it "should return HTTP_REFERER URI without path" do
    controller.request.headers['HTTP_REFERER'] = 'https://host/path1/path2/'
    expect(controller.send(:get_base_url_from_referer, controller.request)).to eq('https://host')
  end

  it "should return empty string if port is 80" do
    expect(controller.send(:get_port_string, 80)).to eq('')
  end

  it "should return empty string if port if 443" do
    expect(controller.send(:get_port_string, 443)).to eq('')
  end

  it "should return formatted port string for all other ports" do
    expect(controller.send(:get_port_string, 3000)).to eq(':3000')
  end
end
