<?php
header('Content-Type: application/json');

// Zabezpieczenie przed nieautoryzowanym dostępem
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die(json_encode(['error' => 'Method not allowed']));
}

// Odczyt danych z żądania
$data = json_decode(file_get_contents('php://input'), true);

if (!is_array($data) || count($data) !== 10) {
    http_response_code(400);
    die(json_encode(['error' => 'Invalid data format']));
}

// Ścieżka do pliku z danymi
$filename = __DIR__ . '/data/responses.json';

// Zapis do pliku
if (file_put_contents($filename, json_encode($data), LOCK_EX) === false) {
    http_response_code(500);
    die(json_encode(['error' => 'Failed to save data']));
}

echo json_encode(['status' => 'success', 'message' => 'All responses saved']);
?>