<?php
 
namespace App;
 
/**
 * PHP SQLite Update Demo
 */
class SQLiteDelete {
 
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
 

	public function deleteOperator($ID) {
		// SQL statement to insert a record
		$sql = "DELETE FROM operators "
			. "WHERE ID = $ID";
		echo "Got $sql";
		$stmt = $this->pdo->query($sql);
		return $stmt;
	}

	public function deleteOwner($ID) {
		// SQL statement to insert a record
		$sql = "DELETE FROM owner "
			. "WHERE ID = $ID";
		echo "Got $sql";
		$stmt = $this->pdo->query($sql);
		return $stmt;
	}

	public function deleteFreqBand($ID) {
		// SQL statement to insert a record
		$sql = "DELETE FROM freqBands "
			. "WHERE ID = $ID";
		echo "Got $sql";
		$stmt = $this->pdo->query($sql);
		return $stmt;
	}

}