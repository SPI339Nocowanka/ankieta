<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$filename = __DIR__ . '/data/responses.json';

if (file_exists($filename)) {
    $data = file_get_contents($filename);
    
    // Sprawdź czy dane są poprawne
    $decoded = json_decode($data, true);
    if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
        echo $data;
    } else {
        // Jeśli plik jest uszkodzony, zwróć pustą strukturę
        echo json_encode(array_fill(0, 10, array_fill(0, 5, 0)));
    }
} else {
    // Jeśli plik nie istnieje, zwróć pustą strukturę
    echo json_encode(array_fill(0, 10, array_fill(0, 5, 0)));
}
?>