<?php

header('Access-Control-Allow-Origin: *');
 
require 'vendor/autoload.php';
 
use App\SQLiteConnection;
use App\SQLiteQuery;
use App\SQLiteCreate;
use App\SQLiteUpdate;
use App\SQLiteDelete;


$pdo = (new SQLiteConnection())->connect();

$sqliteQ = new SQLiteQuery($pdo);
$sqliteC = new SQLiteCreate($pdo);
$sqliteU = new SQLiteUpdate($pdo);
$sqliteD = new SQLiteDelete($pdo);
 
$res = array('error' => false);
$action = 'read';

if (($_SERVER['REMOTE_ADDR'] == '127.0.0.1') or ($_SERVER['REMOTE_ADDR'] == '::1')) {

	if(isset($_GET['action'])){
		$action = $_GET['action'];
	}


	if($action == 'read'){
		if(isset($_GET['table'])){
			$table = $_GET['table'];
			if ($table == 'operators') {
				$result = $sqliteQ->getOperators();
			}

			if ($table == 'owners') {
				$result = $sqliteQ->getOwners();
			}

			if ($table == 'countries') {
				$result = $sqliteQ->getCountries();
			}

			if ($table == 'freqbands') {
				$result = $sqliteQ->getFreqBands();
			} 

			if ($table == 'licenses') {
				$result = $sqliteQ->getLicenses();
			} 

			if ($table == 'frequencies') {
				$license_ID = $_GET['license_ID'];
				$result = $sqliteQ->getFreqAssignment($license_ID);
			}
			if ($table == 'shares') {
				$Operator_ID = $_GET['Operator_ID'];
				$result = $sqliteQ->getShares($Operator_ID);
			}


			if ($result) {
				header("Content-type: application/json");
				echo json_encode($result);
				//echo 'result received';
			}
			else
				echo "[]";
		}
	}

	if($action == 'create'){
		if(isset($_GET['table'])){
			$table = $_GET['table'];
			if ($table == 'operators') {
				$country_ID = $_POST['Country_ID'];
				$operator = $_POST['Operator'];
				$url = $_POST['URL'];
				$wiki_url = $_POST['Wiki_URL'];
				$result = $sqliteC->createOperator($country_ID,$operator,$url,$wiki_url);
			}

			if ($table == 'owners') {
				$country_ID = $_POST['Country_ID'];
				$name = $_POST['Name'];
				$url = $_POST['URL'];
				$wiki_url = $_POST['Wiki_URL'];
				$result = $sqliteC->createOwner($country_ID,$name,$url,$wiki_url);
			}
			if ($table == 'freqbands') {
				$band = $_POST['band'];
				$bandstart = $_POST['bandStart'];
				$bandend = $_POST['bandEnd'];
				$guardstart = $_POST['guardStart'];
				$guardend = $_POST['guardEnd'];
				$type = $_POST['Type'];
				$downlink = $_POST['Downlink'];

				$result = $sqliteC->createFreqBand($band,$bandstart,$bandend,$guardstart,$guardend,$type,$downlink);

			}

			if ($table == 'licenses') {
				$band_ID = $_POST['Band_ID'];
				$operator_ID = $_POST['Operator_ID'];
				$licstartyear = $_POST['licStartYear'];
				$licendyear = $_POST['licEndYear'];
				
				$result = $sqliteC->createLicense($band_ID,$operator_ID,$licstartyear,$licendyear);

			}

			if ($table == 'frequencies') {
				$license_ID = $_POST['license_ID'];
				$freqstart = $_POST['freqStart'];
				$freqend = $_POST['freqEnd'];
				
				$result = $sqliteC->createFrequency($license_ID,$freqstart,$freqend);

			}

			if ($table == 'shares') {
				$investment_ID = $_POST['Investment_ID'];
				$owner_ID = $_POST['Owner_ID'];
				$SharePercent = $_POST['SharePercent'];
				$Type = $_POST['Type'];
				
				$result = $sqliteC->createShare($investment_ID,$owner_ID,$SharePercent,$Type);

			}

			if ($result)
					echo "Record inserted";
			else
					echo "Whoops, something went wrong.";
		}
	}


	if($action == 'update'){
		if(isset($_GET['table'])){
			$table = $_GET['table'];
			if ($table == 'operators') {
				$id = $_POST['ID'];
				$country_ID = $_POST['Country_ID'];
				$operator = $_POST['Operator'];
				$url = $_POST['URL'];
				$wiki_url = $_POST['Wiki_URL'];
				
				$result = $sqliteU->updateOperator($id,$country_ID,$operator,$url,$wiki_url);
			}

			if ($table == 'owners') {
				$id = $_POST['ID'];
				$country_ID = $_POST['Country_ID'];
				$name = $_POST['Name'];
				$url = $_POST['URL'];
				$wiki_url = $_POST['Wiki_URL'];
				
				$result = $sqliteU->updateOwner($id,$country_ID,$name,$url,$wiki_url);
			}

			if ($table == 'freqbands') {
				$id = $_POST['ID'];
				$band = $_POST['band'];
				$bandstart = $_POST['bandStart'];
				$bandend = $_POST['bandEnd'];
				$guardstart = $_POST['guardStart'];
				$guardend = $_POST['guardEnd'];
				$type = $_POST['Type'];
				$downlink = $_POST['Downlink'];

				$result = $sqliteU->updateFreqBand($id,$band,$bandstart,$bandend,$guardstart,$guardend,$type,$downlink);

			}

			if ($table == 'licenses') {
				$id = $_POST['ID'];
				$band_ID = $_POST['Band_ID'];
				$operator_ID = $_POST['Operator_ID'];
				$licstartyear = $_POST['licStartYear'];
				$licendyear = $_POST['licEndYear'];
				
				$result = $sqliteU->updateLicense($id,$band_ID,$operator_ID,$licstartyear,$licendyear);

			}

			if ($table == 'frequencies') {
				$id = $_POST['ID'];
				$license_ID = $_POST['license_ID'];
				$freqstart = $_POST['freqStart'];
				$freqend = $_POST['freqEnd'];
				
				$result = $sqliteU->updateFrequency($id,$license_ID,$freqstart,$freqend);

			}

			if ($table == 'shares') {
				$id = $_POST['ID'];
				$investment_ID = $_POST['Investment_ID'];
				$owner_ID = $_POST['Owner_ID'];
				$SharePercent = $_POST['SharePercent'];
				$Type = $_POST['Type'];
				
				$result = $sqliteU->updateShare($id,$investment_ID,$owner_ID,$SharePercent,$Type);

			}

			if ($result)
					echo "Record updated";
			else
					echo "Whoops, something went wrong.";
		}
	}


	if($action == 'delete'){
		if(isset($_GET['table'])){
			$table = $_GET['table'];
			if ($table == 'operators') {
				$id = $_POST['ID'];
				$result = $sqliteD->deleteOperator($id);
			}

			if ($table == 'owners') {
				$id = $_POST['ID'];
				$result = $sqliteD->deleteOwner($id);
			}
			if ($table == 'freqbands') {
				$id = $_POST['ID'];
				$result = $sqliteD->deleteFreqBand($id);
			}
			if ($table == 'licenses') {
				$id = $_POST['ID'];
				$result = $sqliteD->deleteLicense($id);
			}
			if ($table == 'frequencies') {
				$id = $_POST['ID'];
				$result = $sqliteD->deleteFrequency($id);
			}

			if ($table == 'shares') {
				$id = $_POST['ID'];
				$result = $sqliteD->deleteShare($id);
			}


			if ($result)
					echo "record deleted";
			else
					echo "Whoops, something went wrong.";
		}
	}


	if($action == 'execute'){
		if(isset($_GET['command'])){
			$action = $_GET['command'];
			if ($action == 'writecsv') {			
				$result = shell_exec('sh exportdata.sh');
			}

		}
		if ($result)
			echo "Exported CSV";
		else
			echo "Whoops, something went wrong.";
	}
}

