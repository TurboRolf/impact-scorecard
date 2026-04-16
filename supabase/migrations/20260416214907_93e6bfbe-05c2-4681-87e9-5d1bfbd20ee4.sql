
INSERT INTO public.companies (name, category, country, description, website_url, logo_url) VALUES
-- Svenska medieföretag
('Bonnier', 'Media', 'SE', 'Swedish media group with newspapers, magazines, books, and broadcasting.', 'https://www.bonnier.com', 'https://www.google.com/s2/favicons?domain=bonnier.com&sz=128'),
('Schibsted', 'Media', 'SE', 'Nordic media company operating Aftonbladet, Svenska Dagbladet and online marketplaces.', 'https://schibsted.com', 'https://www.google.com/s2/favicons?domain=schibsted.com&sz=128'),
('Aftonbladet', 'Media', 'SE', 'Sweden''s largest evening newspaper and online news outlet.', 'https://www.aftonbladet.se', 'https://www.google.com/s2/favicons?domain=aftonbladet.se&sz=128'),
('Expressen', 'Media', 'SE', 'Major Swedish tabloid newspaper owned by Bonnier.', 'https://www.expressen.se', 'https://www.google.com/s2/favicons?domain=expressen.se&sz=128'),
('Dagens Nyheter', 'Media', 'SE', 'Sweden''s leading morning newspaper.', 'https://www.dn.se', 'https://www.google.com/s2/favicons?domain=dn.se&sz=128'),
('Svenska Dagbladet', 'Media', 'SE', 'Major Swedish daily newspaper based in Stockholm.', 'https://www.svd.se', 'https://www.google.com/s2/favicons?domain=svd.se&sz=128'),
('SVT', 'Media', 'SE', 'Sveriges Television — Sweden''s public service broadcaster.', 'https://www.svt.se', 'https://www.google.com/s2/favicons?domain=svt.se&sz=128'),
('Sveriges Radio', 'Media', 'SE', 'Sweden''s national publicly funded radio broadcaster.', 'https://sverigesradio.se', 'https://www.google.com/s2/favicons?domain=sverigesradio.se&sz=128'),
('TV4', 'Media', 'SE', 'Swedish commercial television network owned by Telia.', 'https://www.tv4.se', 'https://www.google.com/s2/favicons?domain=tv4.se&sz=128'),
('NENT Group', 'Media', 'SE', 'Nordic Entertainment Group, operator of Viaplay streaming service.', 'https://www.viaplaygroup.com', 'https://www.google.com/s2/favicons?domain=viaplaygroup.com&sz=128'),
('MTG', 'Media', 'SE', 'Modern Times Group — Swedish digital entertainment and esports company.', 'https://www.mtg.com', 'https://www.google.com/s2/favicons?domain=mtg.com&sz=128'),
('Stampen Media', 'Media', 'SE', 'Swedish media group publishing Göteborgs-Posten among others.', 'https://stampen.com', 'https://www.google.com/s2/favicons?domain=stampen.com&sz=128'),
('Göteborgs-Posten', 'Media', 'SE', 'Major daily newspaper based in Gothenburg.', 'https://www.gp.se', 'https://www.google.com/s2/favicons?domain=gp.se&sz=128'),
('Sydsvenskan', 'Media', 'SE', 'Daily newspaper based in Malmö, owned by Bonnier.', 'https://www.sydsvenskan.se', 'https://www.google.com/s2/favicons?domain=sydsvenskan.se&sz=128'),
('Dagens Industri', 'Media', 'SE', 'Sweden''s leading business and financial newspaper.', 'https://www.di.se', 'https://www.google.com/s2/favicons?domain=di.se&sz=128'),
('Norstedts Förlagsgrupp', 'Media', 'SE', 'One of Sweden''s oldest and largest book publishers.', 'https://www.norstedts.se', 'https://www.google.com/s2/favicons?domain=norstedts.se&sz=128'),
('Storytel', 'Media', 'SE', 'Swedish audiobook and e-book streaming service operating globally.', 'https://www.storytel.com', 'https://www.google.com/s2/favicons?domain=storytel.com&sz=128'),
('Acast', 'Media', 'SE', 'Swedish podcast hosting and monetization platform.', 'https://www.acast.com', 'https://www.google.com/s2/favicons?domain=acast.com&sz=128'),
('Bauer Media Sweden', 'Media', 'SE', 'Swedish arm of Bauer Media operating commercial radio stations like Mix Megapol and Rix FM.', 'https://www.bauermedia.se', 'https://www.google.com/s2/favicons?domain=bauermedia.se&sz=128'),
('TT Nyhetsbyrån', 'Media', 'SE', 'Sweden''s leading news agency providing content to most Swedish media.', 'https://tt.se', 'https://www.google.com/s2/favicons?domain=tt.se&sz=128'),
-- Internationella medieföretag
('News Corp', 'Media', 'US', 'Global media conglomerate owning The Wall Street Journal and The Times.', 'https://newscorp.com', 'https://www.google.com/s2/favicons?domain=newscorp.com&sz=128'),
('Comcast', 'Media', 'US', 'American telecommunications and media conglomerate, owner of NBCUniversal.', 'https://corporate.comcast.com', 'https://www.google.com/s2/favicons?domain=comcast.com&sz=128'),
('Netflix', 'Media', 'US', 'Global subscription streaming service for films and series.', 'https://www.netflix.com', 'https://www.google.com/s2/favicons?domain=netflix.com&sz=128'),
('Spotify', 'Media', 'SE', 'Swedish audio streaming and media services provider operating worldwide.', 'https://www.spotify.com', 'https://www.google.com/s2/favicons?domain=spotify.com&sz=128'),
('Reuters', 'Media', 'GB', 'International news agency headquartered in London.', 'https://www.reuters.com', 'https://www.google.com/s2/favicons?domain=reuters.com&sz=128'),
('BBC', 'Media', 'GB', 'British public service broadcaster headquartered in London.', 'https://www.bbc.com', 'https://www.google.com/s2/favicons?domain=bbc.com&sz=128')
ON CONFLICT DO NOTHING;
