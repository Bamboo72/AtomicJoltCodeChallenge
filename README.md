# Atomic Jolt Code Challenge
By Jacob Schwartz
Project mostly created on 12/9/2025

## How to Run the Project Locally
This project is built using Vite. If you know how to run a Vite project, you can skip this section. Otherwise, follow these steps (which were created by Google Gemini):

1. **Clone the Repository:**
Open your terminal or command prompt. Navigate to the directory where you want to save the project. Use the git clone command followed by the repository's URL:
    ```bash
    git clone github.com
    ```
    (Replace github.com with the actual URL of the GitHub repository.) You can find this URL by clicking the "Code" button on the GitHub page for the repository.

2. **Navigate into the Project Directory:**
Once the cloning is complete, change your current directory to the project's folder:
    ```bash
    cd repositoryname
    ```
3. **Install Dependencies:**
A Vite project relies on several packages specified in its package.json file. Install them using npm:
    ```bash
    npm install
    ```
    This command reads the package.json file and downloads all necessary packages into a node_modules folder in your project directory.

4. **Start the Development Server:**
Run this script using npm:
    ```bash
    npm run dev
    ```
    or simply:
    ```bash
    npm start
    ```
    This command starts the Vite development server. It will typically provide a local address (e.g., http://localhost:5173/ or a similar port number) in the terminal output.

5. **View the Project:** Open your web browser and navigate to the address provided in the terminal (e.g., http://localhost:5173/) to see your project running. 

## Resources used
- Vite for project setup: https://vitejs.dev/
- Vue 3 for frontend framework: https://vuejs.org/
- Vitest for testing: https://vitest.dev/
- Draw.io aka diagrams.net for quick mockup: https://app.diagrams.net/
- https://pokeapi.co/ for Pokémon data API - I only used the /pokemon endpoint, getting different lists based on name or id.

### My process using AI:
I used GitHub Copilot (Agent mode - Claude Sonnet 4.5) and Google Gemini in Google for quick searches on how to do specific things.

I used a PRD that I created called [PRD.txt](PRD.txt) to inform the AI on my vision for the project. Then I used GitHub Copilot to create components, write code and test, and help debug issues.
Normally, I would like to take more time and write the code myself, but since the project time limit is 2 to 3 hours, I wanted to leverage AI to help me achieve my vision within the time limit.

I wanted to be transparent about my use of AI, so I've included the two whole chat threads I used for this project in [res/CopilotChat1.md](res/CopilotChat1.md) and [res/CopilotChat2.md](res/CopilotChat2.md)


## My Process
The rest of this README is my process for the project, including brainstorming, time tracking, and what I would do next.

First off, after reading the instructions, I chose to use The Pokémon API: https://pokeapi.co/ and I chose to do Option A: Frontend Focus (Goal: Build a responsive web application that fetches and displays data directly from your chosen API.)

## Initial Brainstorm (I typed my thoughts out in a text file)
Oh, what if I call it the Atomic Pokedex?
What if it's like a canvas plugin? Except the canvas part is just a screenshot, and the interactive part is the actual Pokedex. I looked it up, and a Pokedex website is not a new idea, but it's not quite what I had in mind either. I'm going to keep thinking about it.

Okay, next day, I had a new idea: what if it's a quiz game? You could choose what type of Pokémon trivia you want, and then answer multiple choice. If you get it right, your average will increase. I think that's a fun idea, and probably within the scope of the project.

Fun Fact: I've never actually really played a Pokémon game! I've just watched it on YouTube

Game plan:
1. Test the APIs - Use Bruno if needed
2. Design the app
3. Meet the requirements (Search/Filter, display results cleanly, and show loading)
4. Write tests
5. Expound on the features

It's unclear if research time should be included in the 2 to 3 hours. 
Things I researched
- What endpoints should I use from the API? I'd like to get facts and images
- Refresh on how to make a Vite project since I haven't made a brand new one since last semester

## Time Tracking:
### 12/2/2025, 
Read the project requirements for the first time, and started brainstorming
I think the Pokémon API seems like the most fun option, and I think I'll go with the frontend option. I'm not sure how to make it unique yet though besides a simple Pokémon search tool. 

### 12/3/2025 - 12/8/2025 
Did some brainstorming, but most of my time went to higher priorities at the time- working or studying for finals

### 12/9/2025
Finally had the time to prioritize this project. 

**6:25 - 6:45 PM:** Created the Vite project, started looking more at the API, decided I needed a better vision for the layout, so I made a quick Draw.io sketch of the app layout. ([res/QuickMockup.png](res/QuickMockup.png)) I decided I'll really leverage Copilot for this project so I can achieve my vision.
    
**6:55 - 7:50 PM:** I found the APIs I wanted to use, and then wrote up a Project Requirements Document ([PRD.txt](PRD.txt)) so I could communicate the project vision clearly to Copilot, and had it create the components and basic layout of the app - All of the requirements are now in place (in just under an hour), and now I can focus on polish and achieving my vision for the project. Looking at what it made, I see there's clear steps to move forward.

**8:50 - 9:38 PM:** Back from dinner, ready to keep going. Here's the list of things to do next (I think I'll try working manually for a while now, and if I get stuck, I'll ask Copilot for help):
    - Familiarize myself with the code that Copilot wrote
    - Improve the search bar to search through all Pokemon, not just the page
    - Fix the styling to match my vision better - I want it to look like a Pokedex
    - Add more pagination buttons (first page, last page, next 3 pages, previous 3 pages)
I got these all done, but had to rely on Copilot when I got stuck with the filter bar and buttons. I'm at the 2 hour mark now, so I'll take a break and then come back to make final changes and write tests.

**9:50 - 10:40 PM:** Took a break, now back to finish up. Here's what I have left: 
        - Final styling changes to make it look more like a Pokedex (The sizing and position isn't quite right)
        - Create tests for components

I had some struggle with Copilot over the styling because I decided to make a quick change so the Display component can slide out from the side of the Pokedex. I had to adjust z-index and overflow properties to get it to work right. But I got it done, and then had Copilot generate tests for all components using Vitest.

And with that, I'd say I'm about out of time. Total time spent: About 3 hours. (When you include other factors like brainstorming and writing this report)

## What I Would Do Next:
Quite a few things:
- Make the styling more accurate to a real Pokedex (make it look like screens, add some more details like cool buttons and lights)
- Pay more time for the tests - I just had Copilot generate basic tests, but I would want to write more comprehensive tests
- Add more details to the Pokemon - the API has a lot of data, and I only displayed a few facts. I would add things like evolution lines and what game the Pokemon first appeared in.
- I was thinking of adding the Atomic Jolt logo somewhere - maybe on the Pokedex or on the Canvas page

**Most of all**, I would want to add the quiz game feature I brainstormed earlier. I'm disapointed I didn't get to that because it would add more purpose and fun to the project.