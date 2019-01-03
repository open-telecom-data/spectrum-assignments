<?php
 
namespace App;

class SQLiteQuery {

	/**
	 * PDO object
	 * @var \PDO
	 */
	private $pdo;

	/**
	 * Initialize the object with a specified PDO object
	 */
	public function __construct($pdo) {
			$this->pdo = $pdo;
	}


	/**
	 * Function to get Operators from SQLite database
	 * @return complete array with SQL result or empty array on failure
	 */
	public function getOperators() {
		$stmt = $this->pdo->query('select operators.ID,operators.country_ID,Operator,URL,Wiki_URL,CountryName from operators inner join country on country.ID = operators.Country_ID');
		$operators = array();
		while ($row = $stmt->fetch(\PDO::FETCH_ASSOC)) {
			array_push($operators,$row);
		}
		return $operators;

	}

	/**
	 * Function to get Owners from SQLite database
	 * @return complete array with SQL result or empty array on failure
	 */
	public function getOwners() {
		$stmt = $this->pdo->query('select owner.ID,Name,URL,Wiki_URL,CountryName from owner inner join country on country.ID = owner.Country_ID');
		$owners = array();
		while ($row = $stmt->fetch(\PDO::FETCH_ASSOC)) {
			array_push($owners,$row);
		}
		return $owners;
	}

	public function getCountries() {
		$stmt = $this->pdo->query("select ID,CountryName from country");
		$rowarray = array();
		while ($row = $stmt->fetch(\PDO::FETCH_ASSOC)) {
			array_push($rowarray,$row);
		}
		return $rowarray;
	}

	public function getfreqBands() {
		$stmt = $this->pdo->query("select * from freqBands");
		$rowarray = array();
		while ($row = $stmt->fetch(\PDO::FETCH_ASSOC)) {
			array_push($rowarray,$row);
		}
		return $rowarray;
	}



}