# -*- coding: utf-8 -*
from bs4 import BeautifulSoup
import urllib
import csv
import smtplib
import time
import datetime
r = urllib.urlopen('https://www.africantelecomsnews.com/Operators_Regulators/List_of_African_telecommunications_regulators.html').read()
soup = BeautifulSoup(r, "lxml")
table = soup.find_all("div", id_="wsbtxt7")
articleDate = soup.find("div", {"id": "article-date"}).get_text(strip=True).replace(" ", "-")
#print articleDate

#africa = ["Thailand","something","somethingelse","NewZealand"]
africa = ["Algeria", "Angola", "Benin", "Botswana", "BurkinaFaso", "Burundi", "Cameroon", "CaboVerde", "CentralAfricanRepublic", "Chad", "Comoros", "CongoRep.", "CongoDemRep", "Djibouti", "Egypt", "EquatorialGuinea", "Eritrea", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "CotedIvoire", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius", "Mayotte", "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", "Reunion", "Rwanda", "SaintHelena", "AscensionandTristandaCunha", "SaoTomeandPrincipe", "Senegal", "Seychelles", "SierraLeone", "Somalia", "SouthAfrica", "SouthSudan", "Sudan", "Swaziland", "Tanzania", "Togo", "Tunisia", "Uganda", "WesternSahara", "Zambia", "Zimbabwe"]

with open("commsUpdate.csv", "a") as f:
	writeFile = csv.writer(f, quoting=csv.QUOTE_NONNUMERIC)
	for element in articles:
		category = element.parent.find_previous_sibling('h4').get_text().capitalize()
		country = element.span.a.get_text()
		srchCntry = country.replace(" ", "").replace(".","").encode('ascii', 'ignore')
		if srchCntry in africa:
			link =  website + element.a["href"]
			title = element.a.get_text().replace(u"\u2018", "'").replace(u"\u2019", "'")
			writeFile.writerow([country,link,title,articleDate,category]	)
			body_of_email = body_of_email + '<tr><td>' + country.decode('latin1') + '</td><td><a href="' + link + '">' + title + '</a></td><td>' + articleDate + '</td><td>' + category + '</td></tr>'


content = headers + "\r\n\r\n" + body_of_email

session.sendmail(GMAIL_USERNAME, recipient, content)
#print body_of_email
#print "Email sent!"
