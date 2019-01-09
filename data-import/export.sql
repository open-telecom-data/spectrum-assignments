.mode csv
.headers on
.output operators_sql.csv
select * from operators;

.output owner_sql.csv
select * from owner;

.output shareHolding_sql.csv
select * from shareHolding;

.output spectrumLicense_sql.csv
select * from spectrumLicense;

.output freqAssignment_sql.csv
select * from freqAssignment;

.output freqBands_sql.csv
select * from freqBands;