#!/bin/sh

# Strip CSV headers from files
sed '1d' country.csv > country_nohead.csv
sed '1d' freqBands.csv > freqBands_nohead.csv
sed '1d' ../spectrum-chart/csv/owner.csv > owner_nohead.csv
sed '1d' ../spectrum-chart/csv/operator.csv > operator_nohead.csv
sed '1d' ../spectrum-chart/csv/spectrumLicense.csv > spectrumLicense_nohead.csv
sed '1d' ../spectrum-chart/csv/freqAssignment.csv > freqAssignment_nohead.csv
sed '1d' ../spectrum-chart/csv/shareholding.csv > shareholding_nohead.csv

sqlite3 openspectrum.db < import.sql

rm country_nohead.csv
rm freqBands_nohead.csv
rm owner_nohead.csv
rm operator_nohead.csv
rm spectrumLicense_nohead.csv
rm freqAssignment_nohead.csv
rm shareholding_nohead.csv