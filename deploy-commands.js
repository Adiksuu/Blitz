const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require("dotenv").config();

const BOT_CLIENT_ID = process.env.BOT_CLIENT_ID
const TOKEN = process.env.BOT_TOKEN

const commands = [];

// Rekurencyjnie pobierz wszystkie pliki komend z podkatalogów katalogu "commands"
const commandsPath = path.join(__dirname, 'commands');

const readCommands = (dir) => {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.lstatSync(filePath);

        if (stat.isDirectory()) {
            readCommands(filePath); // Jeśli to jest katalog, kontynuuj rekurencyjne przeszukiwanie
        } else if (file.endsWith('.js')) {
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
            } else {
                console.log(`[OSTRZEŻENIE] Komenda w pliku ${filePath} nie zawiera wymaganych właściwości "data" lub "execute".`);
            }
        }
    }
};

readCommands(commandsPath);

// Utwórz i przygotuj instancję modułu REST
const rest = new REST().setToken(TOKEN);

// Zarejestruj komendy
(async () => {
    try {
        console.log(`Rozpoczęto rejestrację ${commands.length} komend (/).`);

        // Metoda put służy do pełnego odświeżenia wszystkich komend na serwerze
        const data = await rest.put(
            Routes.applicationCommands(BOT_CLIENT_ID),
            { body: commands },
        );

        console.log(`Pomyślnie zarejestrowano ${data.length} komend (/).`);
    } catch (error) {
        console.error(error);
    }
})();