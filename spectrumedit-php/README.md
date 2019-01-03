# PHP layer to SQLite database for Editing Spectrum data

## Installation

1. Install Apache

```
sudo apt-get update -y
sudo apt-get install apache2 -y
sudo systemctl start apache2.service
sudo systemctl enable apache2.service
```

2. Install PHP and SQLite3 support

```
sudo apt-get install php libapache2-mod-php -y
apt-get install php7.2-sqlite3
systemctl restart apache2.service

```


3. Make sure directory permissions are set correctly
```
sudo chmod 646 spectrumedit-php/db/openspectrum.db

```
