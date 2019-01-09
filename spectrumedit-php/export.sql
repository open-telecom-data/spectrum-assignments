.mode csv
.headers on
.output  ../spectrum-chart/csv/operators_sql.csv
select * from operators;

.output ../spectrum-chart/csv/owner_sql.csv
select * from owner;

.output ../spectrum-chart/csv/shareHolding_sql.csv
select * from shareHolding;

.output ../spectrum-chart/csv/spectrumLicense_sql.csv
select * from spectrumLicense;

.output ../spectrum-chart/csv/freqAssignment_sql.csv
select * from freqAssignment;

.output ../spectrum-chart/csv/freqBands_sql.csv
select * from freqBands;
