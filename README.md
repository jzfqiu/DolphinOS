# DolphinOS

<div align="center">
<img width="400" src="https://github.com/jzfqiu/DolphinOS/raw/main/src/assets/geometric-dolphin-clear.png" alt="Geometric Dolphin" />
</div>

## About

### What is this?

DolphinOS is my (Jeff Qiu's) personal website. Designed to imitate the GUI of a simple operating system, it contains a brief overview of my past experience, links to my social media, and some writings that I did for school or for fun. In the future, I also plan to integrate other side projects that has a front-end into this website.  

### Why did you build this?

DolphinOS is my attempt to learn React, then TypeScript, then Redux, then Jest. I am a firm believer of hand-on learning, and a static website with some CSS animations simply does not pose enough challenges. So I contrived a slightly over-complicated design for my personal website to get a taste of what modern front-end frameworks can do.

More importantly, I want to use this project as a learning experience for how professional software engineers approach their work. I try to pay attention to the clarity and maintainability of my code, as if someone else (me) has to work on this project five years from now. Thinking about issues that affect a large codebase maintained by hundreds of professional with such as small personal project may sound a bit ridiculous, but in lieu of a collaborative software development experience one would typically find in an internship, this is the best I can do.

## Deployment

The project is build with Create React App.

- Install dependencies: `npm install`
- Build: `npm build`
- Test: `npm test`
- Run development server: `npm start`

## Todos

- CI
- Improve Mobile support
- More tests for individual components
- Add more fun stuff

## Resources

- [Icon source](https://www.flaticon.com/packs/technology-icon-collection/)
- [Jest cannot transform ESM in React-Markdown](https://github.com/facebook/create-react-app/issues/11946)
- [Test principles](https://kentcdodds.com/blog/write-tests)
- [Test query selector with `data-testid`](https://kentcdodds.com/blog/making-your-ui-tests-resilient-to-change): "The core issue is that the relationship between the test and the source code is too implicit. We can overcome this issue if we make that relationship more explicit." 
- [CI/CD for frontend developers](https://blog.maximeheckel.com/posts/guide-to-cicd-for-frontend-developers/)