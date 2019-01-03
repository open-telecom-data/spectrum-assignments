CREATE TABLE `operators` 
(
	`ID` integer PRIMARY KEY not null,
	`Country_ID` integer not null,
	`Operator` varchar(255) not null,
	`URL` varchar(255),
	`Previously` varchar(255),
	`Wiki_URL` varchar(255),
	`OperatorType` varchar(255),
	`StockExchange` varchar(255),
	`StockSymbol` varchar(255),
	FOREIGN KEY (`Country_ID`)
		REFERENCES `country` (`ID`)
		ON DELETE RESTRICT
                ON UPDATE RESTRICT
);

CREATE TABLE `owner` 
(
	`ID` integer PRIMARY KEY not null,
	`Country_ID` integer not null,
	`Name` varchar(255) not null,
	`URL` varchar(255),
	`Wiki_URL` varchar(255),
	`StockExchange` varchar(255),
	`StockSymbol` varchar(255),
	FOREIGN KEY (`Country_ID`)
		REFERENCES `country` (`ID`)
		ON DELETE RESTRICT
                ON UPDATE RESTRICT
);

CREATE TABLE `shareHolding` 
(
	`ID` integer PRIMARY KEY not null,
	`Investment_ID` integer not null,
	`Owner_ID` integer not null,
	`SharePercent` integer not null,
	`Type` varchar(255),
	FOREIGN KEY (`Owner_ID`)
		REFERENCES `owner` (`ID`)
		ON DELETE RESTRICT
                ON UPDATE RESTRICT,
	FOREIGN KEY (`Investment_ID`)
		REFERENCES `operators` (`ID`)
		ON DELETE RESTRICT
                ON UPDATE RESTRICT
);

CREATE TABLE `spectrumLicense` 
(
	`ID` integer PRIMARY KEY not null,
	`Band_ID` integer not null,
	`Operator_ID` integer not null,
	`licStartYear` integer,
	`licEndYear` integer,
	FOREIGN KEY (`Operator_ID`) 
		REFERENCES `operators` (`ID`)
		ON DELETE RESTRICT
        	ON UPDATE RESTRICT,
	FOREIGN KEY (`Band_ID`)
                REFERENCES `freqBands` (`ID`)
                ON DELETE RESTRICT
                ON UPDATE RESTRICT
);

CREATE TABLE `freqAssignment` 
(
	`ID` integer PRIMARY KEY not null,
	`license_ID` integer not null,
	`freqStart` integer not null,
	`freqEnd` integer not null,
	FOREIGN KEY (`license_ID`)
		REFERENCES `spectrumLicense` (`ID`)
		ON DELETE RESTRICT
                ON UPDATE RESTRICT
);

CREATE TABLE `country` 
(
	`ID` integer PRIMARY KEY not null,
	`CountryName` varchar(255) not null,
	`ISO` varchar(255) not null,
	`Region` varchar(255),
	`SubRegion` varchar(255),
	`ITURegion` integer
);

CREATE TABLE `freqBands` 
(
	`ID` integer PRIMARY KEY not null,
	`band` integer not null,
	`bandStart` integer not null,
	`bandEnd` integer not null,
	`guardStart` integer not null,
	`guardEnd` integer not null,
	`Type` varchar(255) not null,
	`Downlink` char not null
);

PRAGMA foreign_keys = ON;
