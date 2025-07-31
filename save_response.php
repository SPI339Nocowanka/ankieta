<?php
header('Content-Type: application/json');

// Zabezpieczenie przed nieautoryzowanym dostępem
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die(json_encode(['error' => 'Method not allowed']));
}

// Odczyt danych z żądania
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['question']) || !isset($data['option'])) {
    http_response_code(400);
    die(json_encode(['error' => 'Invalid data']));
}

$questionIndex = (int)$data['question'];
$optionIndex = (int)$data['option'];

// Walidacja indeksów
if ($questionIndex < 0 || $questionIndex > 9 || $optionIndex < 0 || $optionIndex > 4) {
    http_response_code(400);
    die(json_encode(['error' => 'Invalid question or option index']));
}

// Ścieżka do pliku z danymi
$filename = __DIR__ . '/data/responses.json';

// Odczyt istniejących odpowiedzi lub inicjalizacja nowej struktury
if (file_exists($filename)) {
    $responses = json_decode(file_get_contents($filename), true);
} else {
    $responses = array_fill(0, 10, array_fill(0, 5, 0));
}

// Aktualizacja odpowiedzi
$responses[$questionIndex][$optionIndex]++;

// Zapis do pliku
if (file_put_contents($filename, json_encode($responses), LOCK_EX) === false) {
    http_response_code(500);
    die(json_encode(['error' => 'Failed to save data']));
}

// Zwróć potwierdzenie
echo json_encode(['status' => 'success', 'question' => $questionIndex, 'option' => $optionIndex]);
?>