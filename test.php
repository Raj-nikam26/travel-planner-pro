<?php
require_once 'config.php';

echo "<h1>Testing Database Connection</h1>";

try {
    $conn = getDBConnection();
    echo "<p style='color: green;'>✅ Database connection successful!</p>";
    
    // Check if tables exist
    $stmt = $conn->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo "<h2>Tables in database:</h2>";
    echo "<ul>";
    foreach ($tables as $table) {
        echo "<li>$table</li>";
    }
    echo "</ul>";
    
    // Count users
    $stmt = $conn->query("SELECT COUNT(*) FROM users");
    $userCount = $stmt->fetchColumn();
    echo "<p>Total users: $userCount</p>";
    
    echo "<h2 style='color: green;'>✅ Everything is working!</h2>";
    
} catch(Exception $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>";
}
?>
