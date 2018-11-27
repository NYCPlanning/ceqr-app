class EmailWhitelist
  def self.on(email)
    domain = email.split('@').second
    WHITELIST.include?(domain.downcase)
  end

  private

  WHITELIST = [
    # Consultants
    'hdrinc.com',
    'hntb.com',
    'hillmannconsulting.com',
    'ataneconsulting.com',
    'samschwartz.com',
    'langan.com',
    'kramerlevin.com',
    'goldmanharris.com',
    'cozen.com',
    'friedfrank.com',
    'akerman.com',
    'rampulla.net',
    'clm.com',
    'emweinsteinpc.com',
    'hklaw.com',
    'stvinc.com',
    'phaeng.com',
    'calladiumgroup.com',
    'vhb.com',
    'urbancartographics.com',
    'environmentalstudiescorp.com',
    'akrf.com',
    'equityenvironmental.com',

    # NYC City
    'planning.nyc.gov',
    'omb.nyc.gov',
    'nypl.org',
    'queenslibrary.org',
    'brooklynpubliclibrary.org',
    'nycsca.org',
    'schools.nyc.gov',
    'nypd.org',
    'fdny.nyc.gov',
    'acs.nyc.gov',
    'dhs.nyc.gov',
    'hra.nyc.gov',
    'aging.nyc.gov',
    'culture.nyc.gov',
    'sbs.nyc.gov',
    'edc.nyc',
    'nycedc.com',
    'hpd.nyc.gov',
    'dob.nyc.gov',
    'health.nyc.gov',
    'nychhc.org',
    'dep.nyc.gov',
    'dsny.nyc.gov',
    'dot.nyc.gov',
    'parks.nyc.gov',
    'dcas.nyc.gov',
    'nycha.nyc.gov',
    'nyct.com',
    'cityhall.nyc.gov',
    'ddc.nyc.gov',
    'sustainability.nyc.gov',

    # Testing address
    'pichot.us'
  ]
end