<?php
if($_SERVER["REQUEST_METHOD"] == "POST") {
    $to = "tom@elektrovlaanderen.be";
    $name = trim($_POST["name"]);
    $email = trim($_POST["email"]);
    $phone = trim($_POST["phone"]);
    $message = trim($_POST["message"]);
    
    // Validatie
    if(empty($name) || empty($email) || empty($message)) {
        http_response_code(400);
        echo "Gelieve alle verplichte velden in te vullen.";
        exit;
    }

    if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Ongeldig e-mailadres formaat";
        exit;
    }

    $subject = "Nieuw bericht van $name via website";
    $email_content = "Naam: $name\n";
    $email_content .= "E-mail: $email\n";
    $email_content .= "Telefoon: ".($phone ? $phone : "Niet opgegeven")."\n\n";
    $email_content .= "Bericht:\n$message\n";

    $headers = "From: $name <$email>";

    if(mail($to, $subject, $email_content, $headers)) {
        header("Location: contact.html"); // Stuur door naar bedankpagina
        exit;
    } else {
        http_response_code(500);
        echo "Er is een fout opgetreden bij het verzenden. Probeer later opnieuw.";
    }
} else {
    http_response_code(403);
    echo "Er is een probleem opgetreden, probeer het later opnieuw.";
}
?>
