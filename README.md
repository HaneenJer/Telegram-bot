# Telegram Bot 

## Overview
This project is a Telegram Polls Manager, a web application designed to manage polls through a Telegram bot interface. Admins can create polls and submit them to users, who will respond via Telegram. The system allows for targeted polling, where only certain users will receive specific questions based on their previous responses. A web-based admin interface allows for viewing poll results in the form of interactive charts.

## Key Components
  ### Telegram Bot: 
  The users interact with the bot for registering, deregistering, and responding to polls.
  ### Flask Backend:
  Handles the main logic, processes requests from the bot, manages admin access, and serves data to the UI.
  ### PostgreSQL Database:
  Stores users, their responses, and poll data.
  ### React-based Admin UI:
  Displays poll results and allows admins to manage polls.

## Features

  ### User Registration:   
  Users can register or deregister from the polling service through the bot.
  ### Poll Management:
  Admins can create, edit, and send polls to specific user groups based on previous responses.
  ### Interactive Charts:
  Poll results are displayed in bar or pie charts using the amCharts web API.
  ### Admin UI:
  Secure interface for admins to view poll results and manage users.

## Requirements

To run this project locally, you'll need the following:

  Python (for Flask)
  
  PostgreSQL (for the database)
  
  Node.js (for React)
  
  Bot Token from Telegram BotFather to connect to the bot.
