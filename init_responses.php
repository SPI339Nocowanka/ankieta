<?php
header('Content-Type: application/json');

$filename = __DIR__ . '/data/responses.json';

// Inicjalizacja pustej struktury danych
$emptyData = array_fill(0, 10, array_fill(0, 5, 0));

if (file_put_contents($filename, json_encode($emptyData), LOCK_EX) {
    echo json_encode(['status' => 'success', 'message' => 'Response file initialized']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to initialize response file']);
}
?>