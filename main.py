#http://geoportal.statistics.gov.uk/datasets/da831f80764346889837c72508f046fa_1?geometry=-0.970%2C51.989%2C-0.496%2C52.063
#https://www.doogal.co.uk/PostcodeDownloads.php
#https://www.gov.uk/government/statistics/english-indices-of-deprivation-2019
#https://www.gov.uk/government/statistics/english-indices-of-deprivation-2015

import ujson
with open('2015dep.json', 'r') as f:
	dep = ujson.load(f)
	dep_old = {}
	#LOSA = Name, Depr, Decile
	losa_data = dep['LSOA name (2011)'].values()
	dep_data = dep['Index of Multiple Deprivation (IMD) Rank (where 1 is most deprived)'].values()
	dec_data = dep['Index of Multiple Deprivation (IMD) Decile (where 1 is most deprived 10% of LSOAs)'].values()
	for index in range(0,32843):
		dep_old[losa_data[index]] = [dep_data[index], dec_data[index]]

with open('2019dep.json', 'r') as f:
	dep = ujson.load(f)
	deprivation = {}
	#LOSA = Name, Depr, Decile
	losa_data = dep['LSOA name (2011)'].values()
	name_data = dep['Local Authority District name (2019)'].values()
	dep_data = dep['Index of Multiple Deprivation (IMD) Rank'].values()
	dec_data = dep['Index of Multiple Deprivation (IMD) Decile'].values()
	for index in range(0,32843):
		deprivation[losa_data[index]] = [name_data[index], dep_data[index], dec_data[index]]

with open('authorities.json', 'r') as f:
	authority_data = ujson.load(f)
	authorities = {}
	name = authority_data['Local Authority District name (2019)'].values()
	rank = authority_data['IMD - Rank of average rank '].values()
	for index in range(0,len(name)-1):
		authorities[name[index]] = rank[index]

with open('postcodes.json', 'r') as f:
	postcodes = ujson.load(f)

def getLOSA(postcode):
	losa = postcodes[postcode]
	return losa.encode('ascii','ignore')

def getAuthority(losa):
	dep_name = deprivation[losa][0]
	return dep_name

def get2019(losa):
	new = [deprivation[losa][1], deprivation[losa][2]]
	return new

def get2015(losa):
	old = dep_old[losa]
	return old

def getAuthorityRank(authority):
	auth_rank = authorities[authority]
	return auth_rank

print getLOSA('MK5 8BD')
print getAuthority(getLOSA('MK5 8BD'))
print getAuthorityRank(getAuthority(getLOSA('MK5 8BD')))
print get2019(getLOSA('MK5 8BD'))
print get2015(getLOSA('MK5 8BD'))

"""
#Loads in Authorities
from pandas import *
import json
xls = ExcelFile('authorities.xlsx')
df = xls.parse(xls.sheet_names[1])

with open('authorities.json', 'w') as outfile:
    json.dump(df.to_dict(), outfile)
"""

"""
#Loads in Postcode -> LOSA
import json
import csv

postcodes = {}

with open ('postcodes.csv','r') as csv_file:
    reader = csv.reader(csv_file)
    next(reader)
    for row in reader:
        postcodes[row[0]] = row[23]
 
with open('postcodes.json', 'w') as f:
    json.dump(postcodes, f)
"""

"""
#Loads in Deprivation Data 2019
from pandas import *
import json
xls = ExcelFile('2019dep.xlsx')
df = xls.parse(xls.sheet_names[1])

with open('2019dep.json', 'w') as outfile:
    json.dump(df.to_dict(), outfile)
"""

"""
#Loads in Deprivation Data 2015
from pandas import *
import json
xls = ExcelFile('2015dep.xlsx')
df = xls.parse(xls.sheet_names[1])

with open('2015dep.json', 'w') as outfile:
    json.dump(df.to_dict(), outfile)
"""