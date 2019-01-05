#!/bin/sh

rm openspectrum.db
sqlite3 openspectrum.db < schema.sql
