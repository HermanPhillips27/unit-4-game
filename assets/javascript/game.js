$(document).ready(function() {
    // VARIABLE DECLARATION
    // ===================================================================
  
    // Creating an object to hold our characters.
    var characters = {
      "Jonesey": {
        name: "Jonesey",
        health: 105,
        attack: 8,
        imageUrl: "assets/images/Jonesy.jpg",
        enemyAttackBack: 15
      },
      "Renegade Raider": {
        name: "Renegade Raider",
        health: 100,
        attack: 14,
        imageUrl: "assets/images/renegadeRaider.jpg",
        enemyAttackBack: 5
      },
      "Black Knight": {
        name: "Black Knight",
        health: 150,
        attack: 8,
        imageUrl: "assets/images/New_Black_Knight.jpg",
        enemyAttackBack: 20
      },
      "The Brat": {
        name: "The Brat",
        health: 180,
        attack: 7,
        imageUrl: "assets/images/theBrat.jpg",
        enemyAttackBack: 25
      }
    };
  
    //variables set to be manipulated later
    var attacker;
    var combatants = [];
    var defender;
    var turnCounter = 1;
    var killCount = 0;
  
    // FUNCTIONS
    // ===================================================================
  
    var renderCharacter = function(character, renderArea) {
      
      var characterDiv = $("<div class='character' data-name='" + character.name + "'>");

      var characterName = $("<div class='character-name'>").text(character.name);

      var characterImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);

      var characterHealth = $("<div class='character-health'>").text(character.health);

      characterDiv.append(characterName).append(characterImage).append(characterHealth);

      $(renderArea).append(characterDiv);
    };
  
    // this function will load all the characters into the character section to be selected
    var startGame = function() {
      // Loop through the characters object and call the renderCharacter function on each character to render their card.
      for (var key in characters) {
        renderCharacter(characters[key], "#characters-section");
      }
    };
  
    // remember to run the function here
    startGame();
  
    // This function handles updating the selected player or the current defender. If there is no selected player/defender this
    // function will also place the character based on the areaRender chosen (e.g. #selected-character or #defender)
    var updateCharacter = function(charObj, areaRender) {
      // First we empty the area so that we can re-render the new object
      $(areaRender).empty();
      renderCharacter(charObj, areaRender);
    };
  
    // This function will render the available-to-attack enemies. This should be run once after a character has been selected
    var renderEnemies = function(enemyArr) {
      for (var i = 0; i < enemyArr.length; i++) {
        renderCharacter(enemyArr[i], "#available-to-attack-section");
      }
    };
  
    // Function to handle rendering game messages.
    var renderMessage = function(message) {
      // Builds the message and appends it to the page.
      var gameMessageSet = $("#game-message");
      var newMessage = $("<div>").text(message);
      gameMessageSet.append(newMessage);
    };
  
    // Function which handles restarting the game after victory or defeat.
    var restartGame = function(resultMessage) {
      // When the 'Restart' button is clicked, reload the page.
      var restart = $("<button>Restart</button>").click(function() {
        location.reload();
      });
  
      // Build div that will display the victory/defeat message.
      var gameState = $("<div>").text(resultMessage);
  
      // Render the restart button and victory/defeat message to the page.
      $("body").append(gameState);
      $("body").append(restart);
    };
  
    // Function to clear the game message section
    var clearMessage = function() {
      var gameMessage = $("#game-message");
  
      gameMessage.text("");
    };
  
    // ===================================================================
  
    // On click event for selecting our character.
    $("#characters-section").on("click", ".character", function() {
      // Saving the clicked character's name.
      let name = $(this).attr("data-name");
  
      // If a player character has not yet been chosen...
      if (!attacker) {
        // We populate attacker with the selected character's information.
        attacker = characters[name];
        // We then loop through the remaining characters and push them to the combatants array.
        for (var key in characters) {
          if (key !== name) {
            combatants.push(characters[key]);
          }
        }
  
        // Hide the character select div.
        $("#characters-section").hide();
  
        // Then render our selected character and our combatants.
        updateCharacter(attacker, "#selected-character");
        renderEnemies(combatants);
      }
    });
  
    // Creates an on click event for each enemy.
    $("#available-to-attack-section").on("click", ".character", function() {
      // Saving the opponent's name.
      var name = $(this).attr("data-name");
  
      // If there is no defender, the clicked enemy will become the defender.
      if ($("#defender").children().length === 0) {
        defender = characters[name];
        updateCharacter(defender, "#defender");
  
        // remove element as it will now be a new defender
        $(this).remove();
        clearMessage();
      }
    });
  
    // When you click the attack button, run the following game logic...
    $("#attack-button").on("click", function() {
      // If there is a defender, combat will occur.
      if ($("#defender").children().length !== 0) {
        // Creates messages for our attack and our opponents counter attack.
        var attackMessage = "You attacked " + defender.name + " for " + attacker.attack * turnCounter + " damage.";
        var counterAttackMessage = defender.name + " attacked you back for " + defender.enemyAttackBack + " damage.";
        clearMessage();
  
        // Reduce defender's health by your attack value.
        defender.health -= attacker.attack * turnCounter;
  
        // If the enemy still has health..
        if (defender.health > 0) {
          // Render the enemy's updated character card.
          updateCharacter(defender, "#defender");
  
          // Render the combat messages.
          renderMessage(attackMessage);
          renderMessage(counterAttackMessage);
  
          // Reduce your health by the opponent's attack value.
          attacker.health -= defender.enemyAttackBack;
  
          // Render the player's updated character card.
          updateCharacter(attacker, "#selected-character");
  
          // If you have less than zero health the game ends.
          // We call the restartGame function to allow the user to restart the game and play again.
          if (attacker.health <= 0) {
            clearMessage();
            restartGame("You have been defeated...GAME OVER!!!");
            $("#attack-button").off("click");
          }
        }
        else {
          // If the enemy has less than zero health they are defeated.
          // Remove your opponent's character card.
          $("#defender").empty();
  
          var gameStateMessage = "You have defeated " + defender.name + ", you can choose to fight another enemy.";
          renderMessage(gameStateMessage);
  
          // Increment your kill count.
          killCount++;
  
          // If you have killed all of your opponents you win.
          // Call the restartGame function to allow the user to restart the game and play again.
          if (killCount >= combatants.length) {
            clearMessage();
            $("#attack-button").off("click");
            restartGame("You Won!!!! GAME OVER!!!");
          }
        }
        // Increment turn counter. This is used for determining how much damage the player does.
        turnCounter++;
      }
      else {
        // If there is no defender, render an error message.
        clearMessage();
        renderMessage("No enemy here.");
      }
    });
  });
  