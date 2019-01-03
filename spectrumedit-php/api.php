<?php
 
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

		/*if ($table == 'shareholding') {
	    $result = $sqliteQ->getShares();
	  }

	  if ($table == 'spectrumlicense') {
	    //$result = $sqliteQ->getSpectrum();
	  }

		if ($table == 'freqassignment') {
      $result = $sqliteQ->getFreqAssignment();
    }*/

		

		if ($result) {
			header("Content-type: application/json");
			echo json_encode($result);
			//echo 'result received';
		}
		else
			echo "Whoops, something wrong happened.";
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

		if ($result)
				echo "record deleted";
		else
				echo "Whoops, something went wrong.";
	}
}
