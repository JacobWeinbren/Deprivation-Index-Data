#GeoJSON Map http://geoportal.statistics.gov.uk/datasets/da831f80764346889837c72508f046fa_1?geometry=-0.970%2C51.989%2C-0.496%2C52.063
#Postcodes https://www.doogal.co.uk/PostcodeDownloads.php
#2019 Dep https://www.gov.uk/government/statistics/english-indices-of-deprivation-2019
#2015 Dep https://www.gov.uk/government/statistics/english-indices-of-deprivation-2015

import json, ujson
import csv
from pandas import *

data = {}

tags_core = {
	'name': 'LSOA name (2011)',
	'authority': 'Local Authority District name (2013)',
	'deprank': 'Index of Multiple Deprivation (IMD) Rank (where 1 is most deprived)',
	'depdec': 'Index of Multiple Deprivation (IMD) Decile (where 1 is most deprived 10% of LSOAs)',
	'incrank': 'Income Rank (where 1 is most deprived)',
	'incdec': 'Income Decile (where 1 is most deprived 10% of LSOAs)',
	'emprank': 'Employment Rank (where 1 is most deprived)',
	'empdec': 'Employment Decile (where 1 is most deprived 10% of LSOAs)',
	'edurank': 'Education, Skills and Training Rank (where 1 is most deprived)',
	'edudec': 'Education, Skills and Training Decile (where 1 is most deprived 10% of LSOAs)',
	'hearank': 'Health Deprivation and Disability Rank (where 1 is most deprived)',
	'headec': 'Health Deprivation and Disability Decile (where 1 is most deprived 10% of LSOAs)',
	'crirank': 'Crime Rank (where 1 is most deprived)',
	'cridec': 'Crime Decile (where 1 is most deprived 10% of LSOAs)',
	'barrank': 'Barriers to Housing and Services Rank (where 1 is most deprived)',
	'bardec': 'Barriers to Housing and Services Decile (where 1 is most deprived 10% of LSOAs)',
	'livrank': 'Living Environment Rank (where 1 is most deprived)',
	'livdec': 'Living Environment Decile (where 1 is most deprived 10% of LSOAs)',
	'chirank': 'Income Deprivation Affecting Children Index (IDACI) Rank (where 1 is most deprived)',
	'chidec': 'Income Deprivation Affecting Children Index (IDACI) Decile (where 1 is most deprived 10% of LSOAs)',
	'oldrank': 'Income Deprivation Affecting Older People (IDAOPI) Rank (where 1 is most deprived)',
	'olddec': 'Income Deprivation Affecting Older People (IDAOPI) Decile (where 1 is most deprived 10% of LSOAs)',
	'yourank': 'Children and Young People Sub-domain Rank (where 1 is most deprived)',
	'youdec': 'Children and Young People Sub-domain Decile (where 1 is most deprived 10% of LSOAs)',
	'adurank': 'Adult Skills Sub-domain Rank (where 1 is most deprived)',
	'adudec': 'Adult Skills Sub-domain Decile (where 1 is most deprived 10% of LSOAs)',
	'georank': 'Geographical Barriers Sub-domain Rank (where 1 is most deprived)',
	'geodec': 'Geographical Barriers Sub-domain Decile (where 1 is most deprived 10% of LSOAs)',
	'barrank': 'Wider Barriers Sub-domain Rank (where 1 is most deprived)',
	'bardec': 'Wider Barriers Sub-domain Decile (where 1 is most deprived 10% of LSOAs)',
	'indrank': 'Indoors Sub-domain Rank (where 1 is most deprived)',
	'inddec': 'Indoors Sub-domain Decile (where 1 is most deprived 10% of LSOAs)',
	'outrank': 'Outdoors Sub-domain Rank (where 1 is most deprived)',
	'outdec': 'Outdoors Sub-domain Decile (where 1 is most deprived 10% of LSOAs)'
}

def sortOut(inputfile, year, tags):
	for tag in tags:
		tags[tag] = inputfile[tags[tag]].values()
	for index in range(0,len(tags['name'])):
		name = tags['name'][index].encode('ascii','ignore')
		if not name in data:
			data[name] = {}
		data[name][year] = {}
		for tag in tags:
			value = tags[tag][index]
			if isinstance(value, unicode):
				data[name][year][tag] = value.encode('ascii','ignore')
			else:
				data[name][year][tag] = value
"""
postcodes = {}
with open ('data/postcodes.csv','r') as csv_file:
    reader = csv.reader(csv_file)
    next(reader)
    for row in reader:
        postcodes[row[0]] = row[23]

with open('data/postcodes.json', 'w') as f:
    json.dump(postcodes, f)

with open('data/postcodes.json', 'r') as f:
    postcodes = ujson.load(f)

def getLOSA(postcode):
	losa = postcodes[postcode]
	return losa
"""

"""
xls = ExcelFile('data/2015.xlsx')
df = xls.parse(xls.sheet_names[0]).to_dict()
with open('data/2015.json', 'w') as f:
    json.dump(df, f)
"""

with open('data/2015.json', 'r') as f:
	old = json.load(f)

tags = tags_core.copy()
tags['authority'] = 'Local Authority District name (2013)'

sortOut(old, '2015', tags)

"""
xls = ExcelFile('data/2019.xlsx')
df = xls.parse(xls.sheet_names[0]).to_dict()
with open('data/2019.json', 'w') as f:
    json.dump(df, f)
"""

with open('data/2019.json', 'r') as f:
    new = json.load(f)

tags = tags_core.copy()
tags['authority'] = 'Local Authority District name (2019)'

sortOut(new, '2019', tags)

with open('data/data.json', 'w') as f:
    json.dump(data, f)
