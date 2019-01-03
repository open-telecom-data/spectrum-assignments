<?php
 
namespace App;
 
/**
 * PHP SQLite Update Demo
 */
class SQLiteUpdate {
 
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
	 * Mark a task specified by the task_id completed
	 * @param type $taskId
	 * @param type $completedDate
	 * @return bool true if success and falase on failure
	 */
 

	public function updateOperator($ID,$country_ID,$operator,$url,$wiki_url) {
		// SQL statement to insert a record
		$sql = "UPDATE operators "
			. "SET Country_ID = $country_ID, "
			. "Operator = '$operator', "
			. "URL = '$url', "
			. "Wiki_URL = '$wiki_url' "
			. "WHERE ID = $ID";
		echo "Got $sql";
		$stmt = $this->pdo->query($sql);
		return $stmt;
	}

	public function updateOwner($ID,$country_ID,$name,$url,$wiki_url) {
		// SQL statement to insert a record
		$sql = "UPDATE owner "
			. "SET Country_ID = $country_ID, "
			. "Name = '$name', "
			. "URL = '$url', "
			. "Wiki_URL = '$wiki_url' "
			. "WHERE ID = $ID";
		echo "Got $sql";
		$stmt = $this->pdo->query($sql);
		return $stmt;
	}


	public function updateFreqBand($ID,$band,$bandstart,$bandend,$guardstart,$guardend,$type,$downlink) {
		// SQL statement to insert a record
		$sql = "UPDATE freqBands "
			. "SET band = $band, "
			. "bandStart = '$bandstart', "
			. "bandEnd = $bandend, "
			. "guardStart = $guardstart, "
			. "guardEnd = $guardend, "
			. "Type = '$type', "
			. "Downlink = '$downlink' "
			. "WHERE ID = $ID";

		echo "Got $sql";
		$stmt = $this->pdo->query($sql);
		return $stmt;
	}

}