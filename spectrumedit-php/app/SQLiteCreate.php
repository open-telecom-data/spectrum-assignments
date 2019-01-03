<?php

namespace App;

/**
 * PHP SQLite Create
 */
class SQLiteCreate {

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

	public function createOperator($country_ID,$operator,$url,$wiki_url) {
    // SQL statement to insert a record
    $sql = "INSERT INTO operators "
      . "('Country_ID', 'Operator', 'URL', 'Wiki_URL') "
      . "VALUES ('$country_ID', '$operator', '$url', '$wiki_url')";

    $stmt = $this->pdo->query($sql);

		return $stmt;
  }

  public function createOwner($country_ID, $name ,$url,$wiki_url) {
    // SQL statement to insert a record
    $sql = "INSERT INTO owner "
      . "('Country_ID', 'Name', 'URL', 'Wiki_URL') "
      . "VALUES ('$country_ID', '$name', '$url', '$wiki_url')";
    echo "$sql";
    $stmt = $this->pdo->query($sql);

    return $stmt;
  }

  public function createFreqBand($band,$bandstart,$bandend,$guardstart,$guardend,$type,$downlink) {
    // SQL statement to insert a record
    $sql = "INSERT INTO freqBands "
      . "('band', 'bandStart', 'bandEnd', 'guardStart', 'guardEnd', 'Type', 'Downlink') "
      . "VALUES ('$band' ,'$bandstart','$bandend','$guardstart','$guardend','$type','$downlink')";
    echo "sql = $sql";
    $stmt = $this->pdo->query($sql);
    
    return $stmt;
  }
}

