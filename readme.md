# Mathy

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)

## Introduction

Mathy is an interactive platform designed to help users practice and improve their mathematical skills through engaging quizzes. It provides a seamless and user-friendly experience for students, teachers, and math enthusiasts looking to test their knowledge.

**Live Demo:** [Loom Video](https://www.loom.com/share/245236bfa9ce436ca169733ac64b695c)

**Live Url:** [Mathy](https://mathy-quizzer.vercel.app/)

### Problem Statement

Many learners struggle with practicing math problems effectively. Some common challenges include:

1. Lack of engaging and interactive math practice tools.
2. The need for instant feedback to correct mistakes and improve understanding.
3. Limited access to personalized math quizzes.

Mathy solves these problems by providing an interactive platform that dynamically generates quizzes, evaluates answers in real-time, and ensures continuous practice by generating new variations of incorrect answers, preventing rote memorization.

## Features

1. **Dynamic Quizzes**: Generate quizzes covering various math topics.
2. **Real-time Feedback**: Instant evaluation and scoring of answers.
3. **User-Friendly Interface**: Easy-to-use platform with an engaging design.
4. **Automatic Question Regeneration**: When a user gets a question wrong, a new variation of the question is generated to reinforce learning.

## Architecture

Mathy consists of a front-end React application and a backend API service.

### Front-end

The front-end is built using React and includes key components such as:

- **Quiz Interface**: Displays questions and answer options dynamically.
- **Instant Feedback System**: Provides real-time evaluation of user responses.
- **Question Regeneration Button**: Allows users to generate new variations of incorrect questions.
- **Progress Overview**: Displays attempted questions and correctness rates.
- **Timer**: Keeps track of quiz duration to improve time management.

### Backend

The backend powers the quiz logic and ensures seamless functionality. Key responsibilities include:

- **User Topic & Quiz Management**: Users can create and retrieve math topics.
- **Quiz Session Handling**: Users can start, save, submit, and review quiz sessions.
- **Adaptive Question Generation**: Generates new question variations when a user answers incorrectly.
- **Performance Tracking**: Stores and analyzes user quiz attempts for insights.
- **Authentication & Security**: Ensures secure user access to personalized quiz sessions.

## Installation

To set up Mathy locally, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/your-repo/math-quizzer.git
cd math-quizzer
```

2. Install dependencies:

```bash
npm i --force
```

## Usage

To run the application locally:

1. Start the front-end development server:

```bash
npm run start
```

2. Open your browser and navigate to `http://localhost:3000` to access Mathy.

