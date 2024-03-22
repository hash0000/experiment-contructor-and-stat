import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedLanguageTable1670415451494 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('9176766d-a797-4bd7-a3d2-4672f1b6f7cc', 'am-ET', 'አማርኛ (ኢትዮጵያ)', 'Ethiopia', 'Amharic');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('90fd73b1-0f89-4c7c-9ec6-eb4be5a8e10b', 'ar-AE', 'العربية (الإمارات العربية المتحدة)', 'U.A.E.', 'Arabic');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('20ea5779-2a53-4900-ba4d-fcdd22f39b8a', 'ar-BH', 'العربية (البحرين)', 'Bahrain', 'Arabic');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('c0940dca-dda0-4da3-99f4-18938ca23bc0', 'ar-DZ', 'العربية (الجزائر)', 'Algeria', 'Arabic');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('f89dd58e-84e9-423c-9254-179347bceff8', 'ar-EG', 'العربية (مصر)', 'Egypt', 'Arabic');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('9bba9cb1-ed0f-4fbf-8067-cb7ac26f15c0', 'ar-IQ', 'العربية (العراق)', 'Iraq', 'Arabic');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('1dd325ac-563e-46d4-b4eb-6fff74478f07', 'ar-JO', 'العربية (الأردن)', 'Jordan', 'Arabic');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('6af4d917-f5fe-4ce0-9682-7538a41e6cae', 'ar-KW', 'العربية (الكويت)', 'Kuwait', 'Arabic');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('7af7076d-8fa4-4fcf-982e-97bc0e999c86', 'ar-LB', 'العربية (لبنان)', 'Lebanon', 'Arabic');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('e270c9b7-441b-4f94-8da6-4c6fba3df149', 'ar-LY', 'العربية (ليبيا)', 'Libya', 'Arabic');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('ce028730-afd1-4c82-a16d-a7ae196cc2e0', 'ar-MA', 'العربية (المملكة المغربية)', 'Morocco', 'Arabic');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('49def8df-1566-4506-8d68-11bedac15c78', 'ar-OM', 'العربية (عمان)', 'Oman', 'Arabic');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('f941e64f-15da-46be-823a-f9c2c37f2a1d', 'ar-QA', 'العربية (قطر)', 'Qatar', 'Arabic');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('ca3e25a8-83f5-45b1-9d2f-d9d9112e63ec', 'ar-SA', 'العربية (المملكة العربية السعودية)', 'Saudi Arabia',
                  'Arabic');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('12d39ffd-1559-410e-a38d-98259cf1c8f0', 'ar-SY', 'العربية (سوريا)', 'Syria', 'Arabic');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('375e7659-cdc4-401b-a706-6fe635a9aed9', 'ar-TN', 'العربية (تونس)', 'Tunisia', 'Arabic');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('9cb3a80e-c693-4d3a-a663-408fb0d876cf', 'ar-YE', 'العربية (اليمن)', 'Yemen', 'Arabic');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('c91a048c-5860-4de7-9b48-945ee835cfcf', 'arn-CL', 'Mapudungun (Chile)', 'Chile', 'Mapudungun');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('331b89c9-11ee-41f5-9313-3fb8f1de58a6', 'as-IN', 'অসমীয়া (ভাৰত)', 'India', 'Assamese');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('45607b56-af46-46a3-b8fc-54f137ad5c2b', 'az-Cyrl-AZ', 'Азәрбајҹан (Азәрбајҹан)', 'Cyrillic, Azerbaijan',
                  'Azeri');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('38bcb4f9-213c-445c-a09c-fb1727db633b', 'az-Latn-AZ', 'Azərbaycan­ılı (Azərbaycanca)', 'Latin, Azerbaijan',
                  'Azeri');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('4b935718-d8d4-4a0d-aa6b-c34a21f6a8ef', 'ba-RU', 'Башҡорт (Россия)', 'Russia', 'Bashkir');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('c268c357-5720-4398-9130-74b154c83803', 'be-BY', 'Беларускі (Беларусь)', 'Belarus', 'Belarusian');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('3a09869b-8fc1-492c-bf69-365eb42d59d7', 'bg-BG', 'български (България)', 'Bulgaria', 'Bulgarian');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('0f06874f-f0d1-43a1-aaf3-83a04c9144c6', 'bn-BD', 'বাংলা (বাংলাদেশ)', 'Bangladesh', 'Bengali');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('2df2cd12-75ad-46c4-b89c-14ffc4f30477', 'bn-IN', 'বাংলা (ভারত)', 'India', 'Bengali');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('2d73bce4-5e78-45c8-8205-359f6af43465', 'bo-CN', 'བོད་ཡིག (ཀྲུང་ཧྭ་མི་དམངས་སྤྱི་མཐུན་རྒྱལ་ཁབ།)',
                  'People\`s Republic of China', 'Tibetan');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('0da33493-215f-4dc5-b028-13d8b650b66e', 'br-FR', 'brezhoneg (Frañs)', 'France', 'Breton');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('1d7aec2d-990d-423d-aa89-cad8713fc4e8', 'bs-Cyrl-BA', 'босански (Босна и Херцеговина)',
                  'Cyrillic Bosnia and Herzegovina', 'Bosnian');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('1628bff7-6573-4074-898a-e5918860a1b4', 'bs-Latn-BA', 'bosanski (Bosna i Hercegovina)',
                  'Latin Bosnia and Herzegovina', 'Bosnian');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('681a8775-3d0b-46bb-a2da-25eb512c0864', 'ca-ES', 'català (català)', 'Catalan', 'Catalan');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('c5a5925d-a3da-483f-bc23-19e5983990a3', 'co-FR', 'Corsu (France)', 'France', 'Corsican');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('1df38308-9a6a-4e69-9b07-dcd7c079a52c', 'cs-CZ', 'čeština (Česká republika)', 'Czech Republic', 'Czech');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('2297ae53-fb77-44cf-8dec-345ae864fc26', 'cy-GB', 'Cymraeg (y Deyrnas Unedig)', 'United Kingdom', 'Welsh');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('4c724986-aa4a-463f-a89f-07c3f54634ff', 'da-DK', 'dansk (Danmark)', 'Denmark', 'Danish');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('0baad1c6-0efe-4634-aa9b-b194bdde367e', 'de-AT', 'Deutsch (Österreich)', 'Austria', 'German');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('f214f1f2-4543-4053-90a5-893aeb29bfc4', 'de-CH', 'Deutsch (Schweiz)', 'Switzerland', 'German');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('c7c22e05-c48b-401d-8702-f5e56435f166', 'de-DE', 'Deutsch (Deutschland)', 'Germany', 'German');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('bd6f2a74-00cb-4e4d-a440-f34f4179ea8a', 'de-LI', 'Deutsch (Liechtenstein)', 'Liechtenstein', 'German');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('766ffb46-aada-445d-b66e-1d4db3018041', 'de-LU', 'Deutsch (Luxemburg)', 'Luxembourg', 'German');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('8ffb25d3-c427-4570-bd20-addbf9ad3782', 'dsb-DE', 'dolnoserbšćina (Nimska)', 'Germany', 'Lower Sorbian');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('2616f57a-67be-4b86-a855-77d80b0b1b9e', 'dv-MV', 'ދިވެހިބަސް (ދިވެހި ރާއްޖެ)', 'Maldives', 'Divehi');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('0ed8766c-91cb-41d3-9350-cc1c1a2e8a91', 'el-GR', 'ελληνικά (Ελλάδα)', 'Greece', 'Greek');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('e8f97695-5b2f-4165-8103-bf0eaaa379da', 'en-029', 'English (Caribbean)', 'Caribbean', 'English');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('8391a8ef-a8c1-4428-bf4b-6db5a6f8ff1f', 'en-AU', 'English (Australia)', 'Australia', 'English');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('333fb32d-fa07-49f1-bda1-726aa5c765ce', 'en-BZ', 'English (Belize)', 'Belize', 'English');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('8133f8bf-5ef2-48bb-8b9b-ceef84745b17', 'en-CA', 'English (Canada)', 'Canada', 'English');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('b71d7a6e-777b-41b6-87d6-a5e7a00176c1', 'en-GB', 'English (United Kingdom)', 'United Kingdom', 'English');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('1a8135f6-6269-43d1-9709-7eef0fa31ef5', 'en-IE', 'English (Eire)', 'Ireland', 'English');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('9265a30a-c2f1-4dad-b8be-94180b49ac84', 'en-IN', 'English (India)', 'India', 'English');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('07a1a710-66c2-4d80-b757-210b490eba43', 'en-JM', 'English (Jamaica)', 'Jamaica', 'English');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('fe616ec6-e460-42b8-9d30-422bf80865fe', 'en-MY', 'English (Malaysia)', 'Malaysia', 'English');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('f53b7ab8-6f66-40d9-8b89-21dff33dd770', 'en-NZ', 'English (New Zealand)', 'New Zealand', 'English');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('11a84ffd-a902-4291-bc22-6fca6e0ef823', 'en-PH', 'English (Philippines)', 'Republic of the Philippines',
                  'English');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('ba08ae24-a11b-489c-880f-26638fc943a4', 'en-SG', 'English (Singapore)', 'Singapore', 'English');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('b9878b2a-bdda-42a9-8177-7ebd10428401', 'en-TT', 'English (Trinidad y Tobago)', 'Trinidad and Tobago',
                  'English');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('a73a1498-9d34-498c-bce1-0c1be92b6bb5', 'en-US', 'English (United States)', 'United States', 'English');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('a6b41551-aaf2-43fb-83b7-dff60bf2277a', 'en-ZA', 'English (South Africa)', 'South Africa', 'English');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('e95e5670-b88e-4772-b51a-e17e6424e2b1', 'en-ZW', 'English (Zimbabwe)', 'Zimbabwe', 'English');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('360ec13a-b307-483a-a5a9-809f4b87fb3f', 'es-AR', 'Español (Argentina)', 'Argentina', 'Spanish');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('1c04178d-8cdd-4b52-9e90-b19b53539aac', 'es-BO', 'Español (Bolivia)', 'Bolivia', 'Spanish');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('ba51a7e2-45d7-40e7-ae60-fe203bcbe574', 'es-CL', 'Español (Chile)', 'Chile', 'Spanish');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('2196950f-63b3-411c-a9e6-33fb8ae1014d', 'es-CO', 'Español (Colombia)', 'Colombia', 'Spanish');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('b3a515f5-0681-4458-a401-40e1180cf086', 'es-CR', 'Español (Costa Rica)', 'Costa Rica', 'Spanish');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('185bdd89-e69f-4437-9250-8da2d27ab73e', 'es-DO', 'Español (República Dominicana)', 'Dominican Republic',
                  'Spanish');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('641fd6cb-7d86-4976-a7d5-fa9ffdd96c63', 'es-ES', 'español (España)', 'Spain', 'Spanish');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('0f663b69-0475-43f0-be89-707bcdd94e86', 'es-GT', 'Español (Guatemala)', 'Guatemala', 'Spanish');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('641285a1-9a72-4eec-aaa2-8c0ec37f98c7', 'es-HN', 'Español (Honduras)', 'Honduras', 'Spanish');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('bc498d51-6a54-4ada-b259-d2f776912788', 'es-MX', 'Español (México)', 'Mexico', 'Spanish');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('fb6f8da3-5251-4791-afad-03dbd8511c4d', 'es-NI', 'Español (Nicaragua)', 'Nicaragua', 'Spanish');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('398795ef-c5fc-433a-b0cd-7f0dc705ac93', 'es-PA', 'Español (Panamá)', 'Panama', 'Spanish');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('c2cf0ec1-d877-4258-b078-8694b66d01ff', 'es-PE', 'Español (Perú)', 'Peru', 'Spanish');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('98a56b72-ec43-4d63-808e-cff2cf4b75e5', 'es-PR', 'Español (Puerto Rico)', 'Puerto Rico', 'Spanish');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('7e68d96d-c925-42f5-a5c8-0b1fc06254db', 'es-PY', 'Español (Paraguay)', 'Paraguay', 'Spanish');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('eaa75679-cc88-47a7-960d-51dba5906084', 'es-SV', 'Español (El Salvador)', 'El Salvador', 'Spanish');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('270ff316-7e14-45d5-8a57-d92f10d95965', 'es-US', 'Español (Estados Unidos)', 'United States', 'Spanish');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('28a7aee5-c183-4925-961a-ff84b49db003', 'es-UY', 'Español (Uruguay)', 'Uruguay', 'Spanish');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('f39555a1-e2c0-434d-aedd-669ba213153d', 'es-VE', 'Español (Republica Bolivariana de Venezuela)', 'Venezuela',
                  'Spanish');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('1245f639-b523-450b-9640-f5802b39f92d', 'et-EE', 'eesti (Eesti)', 'Estonia', 'Estonian');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('2314177a-4807-4438-ada1-e12bafd9015d', 'eu-ES', 'euskara (euskara)', 'Basque', 'Basque');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('6995b22d-5df9-4008-ac5e-62318488aafb', 'fa-IR', 'فارسى (ايران)', 'Iran', 'Persian');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('aae88c1e-d137-4de5-952f-69e45b503e33', 'fi-FI', 'suomi (Suomi)', 'Finland', 'Finnish');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('1ce6224e-5db0-40a2-9f3b-b5644f5c6cd1', 'fil-PH', 'Filipino (Pilipinas)', 'Philippines', 'Filipino');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('47ed5c1f-a591-4f70-9a84-002460816726', 'fo-FO', 'føroyskt (Føroyar)', 'Faroe Islands', 'Faroese');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('c428c00e-ec75-426d-87b4-d1903f8344a8', 'fr-BE', 'français (Belgique)', 'Belgium', 'French');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('e0281d14-5bc2-41a9-a912-016ae1f6b62e', 'fr-CA', 'français (Canada)', 'Canada', 'French');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('2f9a35c5-efa4-4ff1-9916-a729d6849819', 'fr-CH', 'français (Suisse)', 'Switzerland', 'French');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('3830a804-91e8-4dc9-a881-1b922932696e', 'fr-FR', 'français (France)', 'France', 'French');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('fbf40d50-536b-47e5-98a5-989e79e5708a', 'fr-LU', 'français (Luxembourg)', 'Luxembourg', 'French');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('f13dc5e3-ae04-44eb-b825-af572d8e1207', 'fr-MC', 'français (Principauté de Monaco)', 'Principality of Monaco',
                  'French');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('87764398-2054-4609-bb5d-9a7879ea7415', 'fy-NL', 'Frysk (Nederlân)', 'Netherlands', 'Frisian');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('716c4c0d-bc92-4004-bd45-85e4b8ec1a5f', 'ga-IE', 'Gaeilge (Éire)', 'Ireland', 'Irish');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('f2e75217-1b6a-4acc-8928-16772acbf742', 'gl-ES', 'galego (galego)', 'Galician', 'Galician');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('ea425dc5-8f13-439a-a77b-6bcae027b742', 'gsw-FR', 'Elsässisch (Frànkrisch)', 'France', 'Alsatian');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('a0831a9e-7ce7-427e-b8c1-63de3f1436a7', 'gu-IN', 'ગુજરાતી (ભારત)', 'India', 'Gujarati');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('235ffa0d-5e0f-44a7-9177-c3085a345317', 'ha-Latn-NG', 'Hausa (Nigeria)', 'Latin Nigeria', 'Hausa');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('0dadd3e4-23f1-41e5-9c9a-e135a7217b9c', 'he-IL', 'עברית (ישראל)', 'Israel', 'Hebrew');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('4236e1dd-cc32-45b3-9534-98ea8e621591', 'hi-IN', 'हिंदी (भारत)', 'India', 'Hindi');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('a60f0d9c-4dfd-4499-87d7-84ba0cfd59c8', 'hr-BA', 'hrvatski (Bosna i Hercegovina)',
                  'Latin Bosnia and Herzegovina', 'Croatian');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('136b0e0f-a4bf-48db-9177-8af91d52ba00', 'hr-HR', 'hrvatski (Hrvatska)', 'Croatia', 'Croatian');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('400d0d80-677d-4d21-aeaf-69380722b1a5', 'hsb-DE', 'hornjoserbšćina (Němska)', 'Germany', 'Upper Sorbian');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('223a1fe0-382e-41b2-a889-398e63daf5a4', 'hu-HU', 'magyar (Magyarország)', 'Hungary', 'Hungarian');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('232bd402-1991-4a34-8204-1e470ec23d0f', 'hy-AM', 'Հայերեն (Հայաստան)', 'Armenia', 'Armenian');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('a471de95-1e1b-4376-ad52-b5f1763b0971', 'id-ID', 'Bahasa Indonesia (Indonesia)', 'Indonesia', 'Indonesian');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('246a2259-7d39-4aa4-ad3c-f1aa5838ee93', 'ig-NG', 'Igbo (Nigeria)', 'Nigeria', 'Igbo');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('01fe1856-a83d-4e29-a769-24a674ebd763', 'ii-CN', 'ꆈꌠꁱꂷ (ꍏꉸꏓꂱꇭꉼꇩ)', 'People\`s Republic of China', 'Yi');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('750adb57-9e6e-4a18-868c-ca8abf965410', 'is-IS', 'íslenska (Ísland)', 'Iceland', 'Icelandic');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('431cd0d2-1065-4208-b39f-bfe7fc25a598', 'it-CH', 'italiano (Svizzera)', 'Switzerland', 'Italian');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('1dffc7a0-3aaf-4e9d-9169-566d40f8c8e8', 'it-IT', 'italiano (Italia)', 'Italy', 'Italian');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('a1bfc2eb-0810-4e26-afdb-117609545e6e', 'iu-Cans-CA', 'ᐃᓄᒃᑎᑐᑦ (ᑲᓇᑕ)', 'Canada', 'Inuktitut');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('7c817bd3-b948-4208-b96e-5389da0a0a3d', 'iu-Latn-CA', 'Inuktitut (Kanatami) (kanata)', 'Latin Canada',
                  'Inuktitut');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('ccc1f50d-d8db-4935-b524-e8ac27687e49', 'ja-JP', '日本語 (日本)', 'Japan', 'Japanese');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('b8303264-4cd5-4da5-8f44-1a17ad7a8158', 'ka-GE', 'ქართული (საქართველო)', 'Georgia', 'Georgian');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('fe2a4084-5b02-43f5-894d-be083d122ade', 'kk-KZ', 'Қазақ (Қазақстан)', 'Kazakhstan', 'Kazakh');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('7e53631c-c1f9-4b50-b2cc-d724e8fda0d3', 'kl-GL', 'kalaallisut (Kalaallit Nunaat)', 'Greenland', 'Greenlandic');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('9b7447ae-e2b5-42f7-aedc-6e259dd8c920', 'km-KH', 'ខ្មែរ (កម្ពុជា)', 'Cambodia', 'Khmer');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('b9467a16-4fba-48d8-8907-268c93a80197', 'kn-IN', 'ಕನ್ನಡ (ಭಾರತ)', 'India', 'Kannada');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('4e204afe-df35-483c-86ad-62d8b00ac13e', 'ko-KR', '한국어 (대한민국)', 'Korea', 'Korean');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('d0e41448-dd53-474f-8720-575e51c4d6c0', 'kok-IN', 'कोंकणी (भारत)', 'India', 'Konkani');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('7e250080-b93c-4b98-b552-948bd90fe549', 'ky-KG', 'Кыргыз (Кыргызстан)', 'Kyrgyzstan', 'Kyrgyz');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('954f6e62-134c-41b6-9524-b79d71d060d6', 'lb-LU', 'Lëtzebuergesch (Luxembourg)', 'Luxembourg', 'Luxembourgish');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('2bab9cb4-ccf6-4631-901d-495cf8ad7bd6', 'lo-LA', 'ລາວ (ສ.ປ.ປ. ລາວ)', 'Lao P.D.R.', 'Lao');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('7045a3a9-8e0b-4c9e-8ec2-d48890ccb9aa', 'lt-LT', 'lietuvių (Lietuva)', 'Lithuania', 'Lithuanian');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('1c286004-fd17-45aa-aa48-4563ff28eae0', 'lv-LV', 'latviešu (Latvija)', 'Latvia', 'Latvian');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('7df24afd-b408-4f24-8d54-bc56cfc32e70', 'mk-MK', 'македонски јазик (Македонија)',
                  'Former Yugoslav Republic of Macedonia', 'Macedonian');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('6cee3c10-bc8b-48a0-a2b9-c72b66d2715d', 'ml-IN', 'മലയാളം (ഭാരതം)', 'India', 'Malayalam');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('32c5d102-0366-46ef-8fa0-0f0fa46034ab', 'mn-MN', 'Монгол хэл (Монгол улс)', 'Cyrillic, Mongolia', 'Mongolian');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('d952eeae-649d-4a3b-9c81-82a1d7a7a07a', 'mn-Mong-CN', 'ᠮᠤᠨᠭᠭᠤᠯ ᠬᠡᠯᠡ (ᠪᠦᠭᠦᠳᠡ ᠨᠠᠢᠷᠠᠮᠳᠠᠬᠤ ᠳᠤᠮᠳᠠᠳᠤ ᠠᠷᠠᠳ ᠣᠯᠣᠰ)',
                  'Traditional Mongolian People\`s Republic of China', 'Mongolian');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('b91dca85-c619-48de-b604-3f2e8fb7b52a', 'moh-CA', 'Kanien\`kéha (Canada)', 'Canada', 'Mohawk');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('a47ffa8d-c2bd-4fc8-9a87-06162da4f113', 'mr-IN', 'मराठी (भारत)', 'India', 'Marathi');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('8eac76b7-4315-4f66-82ec-9cfb67bfb925', 'ms-BN', 'Bahasa Malaysia (Brunei Darussalam)', 'Brunei Darussalam',
                  'Malay');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('9118e70c-db38-44af-972f-3c943e1d552e', 'ms-MY', 'Bahasa Malaysia (Malaysia)', 'Malaysia', 'Malay');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('5f713841-2d9d-4fd7-a4c5-6047368f0c9f', 'mt-MT', 'Malti (Malta)', 'Malta', 'Maltese');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('31bb11f1-e05f-45ea-9a52-3b6029ca2d4b', 'nb-NO', 'norsk, bokmål (Norge)', 'Norway', 'Norwegian, Bokmål');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('90c946ad-3caf-4bbd-814a-2371c4ed09ce', 'ne-NP', 'नेपाली (नेपाल)', 'Nepal', 'Nepali');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('d82c1a4e-9414-47c4-855d-ff4781936355', 'nl-BE', 'Nederlands (België)', 'Belgium', 'Dutch');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('1fc8369f-bd87-4887-b289-0b7726fe852c', 'nl-NL', 'Nederlands (Nederland)', 'Netherlands', 'Dutch');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('e4f1c277-0e6a-43a6-abb2-8fc8cdf4ab42', 'nn-NO', 'norsk, nynorsk (Noreg)', 'Norway', 'Norwegian, Nynorsk');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('f270558f-a2d4-4dfd-abbb-49dd7eb63c2a', 'nso-ZA', 'Sesotho sa Leboa (Afrika Borwa)', 'South Africa',
                  'Sesotho sa Leboa');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('175e5ee1-529f-4c5c-b7cf-8af9e845cb85', 'oc-FR', 'Occitan (França)', 'France', 'Occitan');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('720af55a-224a-4b38-971f-53b04f1fd6f5', 'or-IN', 'ଓଡ଼ିଆ (ଭାରତ)', 'India', 'Oriya');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('ed8f5bdc-c9c1-48c9-bd72-1a509dce469b', 'pa-IN', 'ਪੰਜਾਬੀ (ਭਾਰਤ)', 'India', 'Punjabi');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('55ba95f6-ec22-4e44-8f57-522ba0b0d50a', 'pl-PL', 'polski (Polska)', 'Poland', 'Polish');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('c43211d0-f3c3-4dde-ab33-dd638e84c5c9', 'prs-AF', 'درى (افغانستان)', 'Afghanistan', 'Dari');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('5bc9589b-df6e-421c-87ec-818ccd02fa0b', 'ps-AF', 'پښتو (افغانستان)', 'Afghanistan', 'Pashto');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('c0b89a4e-4261-4dae-a795-b59af88cd8c5', 'pt-BR', 'Português (Brasil)', 'Brazil', 'Portuguese');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('93d94f11-8525-4847-bc0c-0d6fe192cd60', 'pt-PT', 'português (Portugal)', 'Portugal', 'Portuguese');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('75dbc60e-51e1-4c14-bca7-202c6332a093', 'qut-GT', 'K\`iche (Guatemala)', 'Guatemala', 'K\`iche');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('8812aa9f-c2e7-48a1-bf9a-83c77cfbe346', 'quz-BO', 'runasimi (Bolivia Suyu)', 'Bolivia', 'Quechua');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('811ae644-8a71-4890-91fd-58d026e57450', 'quz-EC', 'runasimi (Ecuador Suyu)', 'Ecuador', 'Quechua');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('d0c863e2-89a6-4c87-9a93-cd82f1088d4b', 'quz-PE', 'runasimi (Peru Suyu)', 'Peru', 'Quechua');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('5dd748b3-e9a4-4567-bc6b-6d828fc0cae8', 'rm-CH', 'Rumantsch (Svizra)', 'Switzerland', 'Romansh');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('8340d956-4a30-4868-9145-10d5987303d1', 'ro-RO', 'română (România)', 'Romania', 'Romanian');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('b3730100-a07d-4f3c-b7bd-3f899ccf2dbf', 'ru-RU', 'русский (Россия)', 'Russia', 'Russian');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('ee277440-8be1-4e92-af6d-775fdffc4e2f', 'rw-RW', 'Kinyarwanda (Rwanda)', 'Rwanda', 'Kinyarwanda');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('060b5ca5-e773-4502-bd86-891c43d8e852', 'sa-IN', 'संस्कृत (भारतम्)', 'India', 'Sanskrit');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('2c950217-72cc-4a19-b91c-d12d036be231', 'sah-RU', 'саха (Россия)', 'Russia', 'Yakut');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('324ad30a-6771-491b-836a-3b07bd8ef5c5', 'se-FI', 'davvisámegiella (Suopma)', 'Northern Finland', 'Sami');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('0aa4da8b-5b18-4b48-b01b-8ffbb27a7ff0', 'se-NO', 'davvisámegiella (Norga)', 'Northern Norway', 'Sami');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('8f6ff53a-b97a-4d70-a186-d8fc2ae000cb', 'se-SE', 'davvisámegiella (Ruoŧŧa)', 'Northern Sweden', 'Sami');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('4153bb59-3452-4c1c-99a6-aef66d2aa269', 'si-LK', 'සිංහ (ශ්‍රී ලංකා)', 'Sri Lanka', 'Sinhala');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('3df78eff-700e-445f-9133-8d89735e0516', 'sk-SK', 'slovenčina (Slovenská republika)', 'Slovakia', 'Slovak');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('cb367e19-21e9-4741-a6ad-e2491613f3ba', 'sl-SI', 'slovenski (Slovenija)', 'Slovenia', 'Slovenian');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('ddbca7d8-20c0-4adc-9478-bf45a7b82a91', 'sma-NO', 'åarjelsaemiengiele (Nöörje)', 'Southern Norway', 'Sami');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('5ef5d961-b06c-42fb-b032-33d8f8334353', 'sma-SE', 'åarjelsaemiengiele (Sveerje)', 'Southern Sweden', 'Sami');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('18ee6c34-40f6-48a3-be8f-95b552f54fdc', 'smj-NO', 'julevusámegiella (Vuodna)', 'Lule Norway', 'Sami');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('df3a1e55-0505-49c0-a0a5-aadd36af1eb8', 'smj-SE', 'julevusámegiella (Svierik)', 'Lule Sweden', 'Sami');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('b83b3e5e-b723-47d7-99a3-f61710f0f242', 'smn-FI', 'sämikielâ (Suomâ)', 'Inari Finland', 'Sami');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('2756a7a6-b083-41f4-9076-bdfe449df53b', 'sms-FI', 'sääm´ǩiõll (Lää´ddjânnam)', 'Skolt Finland', 'Sami');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('70e850ce-8889-4e5a-bf04-360c0317aad7', 'sq-AL', 'shqipe (Shqipëria)', 'Albania', 'Albanian');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('a8f716ea-f32f-426f-bcfa-9dc4f50ae821', 'sr-Cyrl-BA', 'српски (Босна и Херцеговина)',
                  'Cyrillic Bosnia and Herzegovina', 'Serbian');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('7c5a5b5a-5446-4146-9c46-9a5fbd91052c', 'sr-Cyrl-CS', 'српски (Србија)', 'Cyrillic, Serbia', 'Serbian');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('28ed3bac-6a33-48e9-a5f9-09b64341b297', 'sr-Latn-BA', 'srpski (Bosna i Hercegovina)',
                  'Latin Bosnia and Herzegovina', 'Serbian');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('83b8cf31-29e6-44ad-b6e5-8ab16e50a113', 'sr-Latn-CS', 'srpski (Srbija)', 'Latin, Serbia', 'Serbian');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('6b325d1f-c4f6-45b2-a90d-c4d9f4af76b6', 'sv-FI', 'svenska (Finland)', 'Finland', 'Swedish');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('413550be-e106-429b-a841-e522ce74e496', 'sv-SE', 'svenska (Sverige)', 'Sweden', 'Swedish');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('087d0252-6eaa-458c-9e3f-330540022252', 'sw-KE', 'Kiswahili (Kenya)', 'Kenya', 'Kiswahili');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('824fd450-8755-4dd8-893e-abb542b339e6', 'syr-SY', 'ܣܘܪܝܝܐ (سوريا)', 'Syria', 'Syriac');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('6ae93572-b76a-4c3a-ae7d-a7355c88fe17', 'ta-IN', 'தமிழ் (இந்தியா)', 'India', 'Tamil');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('60ebc3e0-96fa-4794-9821-8e6edb87e915', 'te-IN', 'తెలుగు (భారత దేశం)', 'India', 'Telugu');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('276c1613-ce33-4659-94d5-9ff9db2c8429', 'tg-Cyrl-TJ', 'Тоҷикӣ (Тоҷикистон)', 'Cyrillic Tajikistan', 'Tajik');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('782f6437-e66e-41e4-8b6f-a1e94a50aa84', 'af-ZA', 'Afrikaans (Suid Afrika)', 'South Africa', 'Afrikaans');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('c7f43acf-b7b5-473e-ade3-96c61aa0fada', 'es-EC', 'Español (Ecuador)', 'Ecuador', 'Spanish');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('4a8534dd-1fa0-4ff6-899f-45a8327f870f', 'mi-NZ', 'Reo Māori (Aotearoa)', 'New Zealand', 'Maori');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('6d86726f-d3e4-4363-8ddb-ce468efac5ad', 'th-TH', 'ไทย (ไทย)', 'Thailand', 'Thai');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('959038b2-8bcd-4d70-9a53-f6ff946b37de', 'tk-TM', 'türkmençe (Türkmenistan)', 'Turkmenistan', 'Turkmen');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('4210f5be-f100-452b-a6b4-30d26f86873d', 'tn-ZA', 'Setswana (Aforika Borwa)', 'South Africa', 'Setswana');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('591dc5a6-22a0-4946-ada0-fab0bc4d94ef', 'tr-TR', 'Türkçe (Türkiye)', 'Turkey', 'Turkish');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('948a6509-ff11-448f-955e-59e722dbd709', 'tt-RU', 'Татар (Россия)', 'Russia', 'Tatar');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('81bd8729-32bf-47be-b09f-65d3aafacd5c', 'tzm-Latn-DZ', 'Tamazight (Djazaïr)', 'Latin Algeria', 'Tamazight');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('17e3b402-7fb2-4bd9-af46-c8b1e9e452c4', 'ug-CN', 'ئۇيغۇر يېزىقى (جۇڭخۇا خەلق جۇمھۇرىيىتى)',
                  'People\`s Republic of China', 'Uighur');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('e4b25440-0abc-4bf6-9485-4cb9e06835f6', 'uk-UA', 'україньска (Україна)', 'Ukraine', 'Ukrainian');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('0088f7e9-8622-4ab9-a7ab-f2173edf9a7f', 'ur-PK', 'اُردو (پاکستان)', 'Islamic Republic of Pakistan', 'Urdu');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('b23014e3-dd19-4bbf-995b-a2d1e3a300ce', 'uz-Cyrl-UZ', 'Ўзбек (Ўзбекистон)', 'Cyrillic, Uzbekistan', 'Uzbek');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('a1e902e3-b958-4e14-83e6-1f54aa95b57d', 'uz-Latn-UZ', 'Uzbek (Uzbekiston Respublikasi)', 'Latin, Uzbekistan',
                  'Uzbek');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('aaf8c0d4-818a-4044-a4bc-3aa962e4ce84', 'vi-VN', 'Tiếng Việt (Việt Nam)', 'Vietnam', 'Vietnamese');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('a8dca995-14f5-42e9-911a-d991464fb855', 'wo-SN', 'Wolof (Sénégal)', 'Senegal', 'Wolof');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('ba637d98-f79c-4fc1-b434-7db4a3549a39', 'xh-ZA', 'isiXhosa (uMzantsi Afrika)', 'South Africa', 'isiXhosa');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('ab724e4e-f03b-4c1a-8fcd-69b90b2d339d', 'yo-NG', 'Yoruba (Nigeria)', 'Nigeria', 'Yoruba');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('890e4f8b-3214-4f78-b8a6-4ec127e7c621', 'zh-CHS', '中文(简体)', 'Simplified', 'Chinese');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('1009313f-c1b2-45cf-b436-2872b2ae8467', 'zh-CHT', '中文(繁體)', 'Traditional', 'Chinese');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('dfe1e6b5-9c71-43c2-8237-bc892d5e3308', 'zh-CN', '中文(中华人民共和国)', 'People\`s Republic of China',
                  'Chinese');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('5455b278-aba7-4b08-b3b8-fef6ce93457e', 'zh-HK', '中文(香港特别行政區)', 'Hong Kong S.A.R.', 'Chinese');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('db89e227-ff66-4152-be98-ba5fa1596121', 'zh-MO', '中文(澳門特别行政區)', 'Macao S.A.R.', 'Chinese');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('51d2f186-776a-4fe7-b35c-4031e1a87a9b', 'zh-SG', '中文(新加坡)', 'Singapore', 'Chinese');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('da1bad52-86ce-40e9-9d5b-c2f50a25d0b5', 'zh-TW', '中文(台灣)', 'Taiwan', 'Chinese');
          INSERT INTO public."Language" (id, code, native, region, title)
          VALUES ('f94393ee-4263-45f7-85d7-946444b57292', 'zu-ZA', 'isiZulu (iNingizimu Afrika)', 'South Africa', 'isiZulu');
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
