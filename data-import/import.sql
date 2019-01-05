CREATE TABLE `owner_tmp`
( 
        `ID` integer not null,
        `Name` varchar(255) not null,
        `URL` varchar(255),
        `Wiki_URL` varchar(255),
        `ISO` varchar(255)
);
CREATE TABLE `operator_tmp`
(       
        `ID` integer not null,
        `ISO` varchar(255),
        `Operator` varchar(255) not null,
        `URL` varchar(255),
        `Previously` varchar(255),
        `Wiki_URL` varchar(255)
);

CREATE TABLE `spectrumLicense_tmp`
(
        `ID` integer not null,
        `Country` varchar(255),
        `ISO` varchar(255),
        `Operator` varchar(255),
        `Operator_ID` varchar(255),
        `Band` varchar(255),
        `Type` varchar(255)
);


CREATE TABLE `freqAssignment_tmp`
(
        `ID` integer not null,
        `license_ID` varchar(255),
        `freqStart` varchar(255),
        `freqEnd` varchar(255) 
);

CREATE TABLE `shareholding_tmp`
(
        `ID` integer not null,
        `Owner_ID` varchar(255),
        `Operator_ID` varchar(255),
        `SharePercent` real 
);

PRAGMA foreign_keys = ON;

.mode csv

.import country_nohead.csv country
.import freqBands_nohead.csv freqBands
.import owner_nohead.csv owner_tmp
.import operator_nohead.csv operator_tmp
.import spectrumLicense_nohead.csv spectrumLicense_tmp
.import freqAssignment_nohead.csv freqAssignment_tmp
.import shareholding_nohead.csv shareHolding_tmp

.mode list

/* remove trailing spaces from ISO */
update owner_tmp set ISO = RTRIM(ISO);

/* Subsitute GB for ISO 3166-2 and ISO 3166-1 alpha-3 */
update owner_tmp set ISO='gb' where ISO ='uk';

insert into operators (ID,Operator,URL,Previously,Wiki_URL,Country_ID) 
	select operator_tmp.ID,Operator,URL,Previously,Wiki_URL,Country.ID 
	from operator_tmp inner join country on UPPER(country.ISO) = UPPER(operator_tmp.ISO);

insert into owner (ID,Name,URL,Wiki_URL,Country_ID)
	select owner_tmp.ID,Name,URL,Wiki_URL,Country.ID 
	from owner_tmp inner join country on UPPER(country.ISO) like UPPER(owner_tmp.ISO);

insert into  spectrumLicense (ID,Operator_ID,Band_ID) 
	select spectrumLicense_tmp.ID,Operator_ID,freqBands.ID 
	from spectrumLicense_tmp inner join freqBands on spectrumLicense_tmp.Band = freqBands.band where operator_ID <> '#N/A';

insert into freqAssignment (ID,license_ID,freqStart,freqEnd)
	select freqAssignment_tmp.ID,license_ID,freqStart,freqEnd 
	from freqAssignment_tmp inner join spectrumLicense where freqAssignment_tmp.license_ID = spectrumLicense.ID;

insert into shareHolding (ID,Investment_ID,Owner_ID,SharePercent)
	select shareholding_tmp.ID,shareholding_tmp.Operator_ID,shareholding_tmp.Owner_ID,SharePercent 
	from shareholding_tmp where typeof(shareholding_tmp.SharePercent) = "real";


