<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config.php';

// Check if user is logged in
if (!isLoggedIn()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

$conn = getDBConnection();
$userId = getCurrentUserId();

// Save trip
if ($method === 'POST' && $action === 'save') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    try {
        $stmt = $conn->prepare("INSERT INTO trips (user_id, trip_id, destination, duration, budget, travel_style, traveler_type, special_requirements, content, sources, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        $stmt->execute([
            $userId,
            $data['id'],
            $data['destination'],
            $data['duration'],
            $data['budget'],
            $data['travelStyle'],
            $data['travelerType'],
            $data['specialRequirements'] ?? null,
            $data['content'],
            $data['sources'] ?? null,
            $data['timestamp']
        ]);
        
        echo json_encode(['success' => true, 'message' => 'Trip saved successfully']);
        
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
}

// Get all trips
elseif ($method === 'GET' && $action === 'all') {
    try {
        $stmt = $conn->prepare("SELECT * FROM trips WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->execute([$userId]);
        $trips = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode(['success' => true, 'trips' => $trips]);
        
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
}

// Get single trip
elseif ($method === 'GET' && $action === 'get') {
    $tripId = $_GET['trip_id'] ?? '';
    
    try {
        $stmt = $conn->prepare("SELECT * FROM trips WHERE trip_id = ? AND user_id = ?");
        $stmt->execute([$tripId, $userId]);
        $trip = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($trip) {
            echo json_encode(['success' => true, 'trip' => $trip]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Trip not found']);
        }
        
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
}

// Delete trip
elseif ($method === 'DELETE' && $action === 'delete') {
    $tripId = $_GET['trip_id'] ?? '';
    
    try {
        $stmt = $conn->prepare("DELETE FROM trips WHERE trip_id = ? AND user_id = ?");
        $stmt->execute([$tripId, $userId]);
        
        echo json_encode(['success' => true, 'message' => 'Trip deleted successfully']);
        
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
}

// Clear all trips
elseif ($method === 'DELETE' && $action === 'clear') {
    try {
        $stmt = $conn->prepare("DELETE FROM trips WHERE user_id = ?");
        $stmt->execute([$userId]);
        
        echo json_encode(['success' => true, 'message' => 'All trips deleted successfully']);
        
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
}

else {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
}
?>
