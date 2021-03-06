var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
} // Made by Yago Estévez (Twitter: @yagoestevez.com)


/***********************
  Menu Component
 ***********************/

var Menu = function Menu(props) {
  return (
    React.createElement("div", {
        className: "menu-container " + props.showMenu
      },
      React.createElement("div", {
        className: "overlay"
      }),
      React.createElement("div", {
          className: "menu-items"
        },
        React.createElement("ul", null,
          React.createElement("li", null,
            React.createElement("a", {
              href: "#welcome-section",
              onClick: props.toggleMenu
            }, "HOME")),



          React.createElement("li", null,
            React.createElement("a", {
              href: "#about",
              onClick: props.toggleMenu
            }, "ABOUT")),



          React.createElement("li", null,
            React.createElement("a", {
              href: "#projects",
              onClick: props.toggleMenu
            }, "PORTFOLIO")),



          React.createElement("li", null,
            React.createElement("a", {
              href: "documents/resumes.html",
              onClick: props.toggleMenu
            }, "RESUMES")),



          React.createElement("li", null,
            React.createElement("a", {
              href: "#contact",
              onClick: props.toggleMenu
            }, "CONTACT"))),




        React.createElement(SocialLinks, null))));



};


/***********************
     Nav Component
    ***********************/

var Nav = function Nav(props) {
  return (
    React.createElement(React.Fragment, null,
      React.createElement("nav", {
          id: "navbar"
        },
        React.createElement("div", {
            className: "nav-wrapper"
          },
          React.createElement("p", {
              className: "brand"
            }, "D",

            React.createElement("strong", null, "Everett"), "Hinton"),

          React.createElement("a", {
              onClick: props.toggleMenu,
              className: props.showMenu === 'active' ? 'menu-button active' : 'menu-button'
            },

            React.createElement("span", null))))));





};



/***********************
     Header Component
    ***********************/

var Header = function Header(props) {
  return (
    React.createElement("header", {
        id: "welcome-section"
      },
      React.createElement("div", {
        className: "forest"
      }),
      React.createElement("div", {
        className: "silhouette"
      }),
      React.createElement("div", {
        className: "moon"
      }),
      React.createElement("div", {
          className: "container"
        },
        React.createElement("h1", null,
          React.createElement("span", {
            className: "line"
          }, "For when you"),
          React.createElement("span", {
            className: "line"
          }, "need to get stuff"),
          React.createElement("span", {
              className: "line"
            },
            React.createElement("span", {
              className: "color"
            }, "done"), ".")),


        React.createElement("div", {
            className: "buttons"
          },
          React.createElement("a", {
            href: "#projects"
          }, "my portfolio"),
          React.createElement("a", {
            href: "#contact",
            className: "cta"
          }, "get in touch")))));






};


/***********************
     About Component
    ***********************/

var About = function About(props) {
  return (
    React.createElement("section", {
        id: "about"
      },
      React.createElement("div", {
          className: "wrapper"
        },
        React.createElement("article", null,
          React.createElement("div", {
              className: "title"
            },
            React.createElement("h3", null, "\"Hey, you. You're finally awake.\""),
            React.createElement("p", {
              className: "separator"
            })),

          React.createElement("div", {
              className: "desc full"
            },
            React.createElement("h4", {
              className: "subtitle"
            }, "Most call me Everett. "),
            React.createElement("p", null, "I'm an artist at heart. My passions are game development, graphic design, and even music-- I'd like to bring that creativity into the real world, and use math, engineering, and physics to affect as many people I can in a positive way."),



            React.createElement("p", null, "At the same time, the future is my fascination, and I want to work in every way I can towards bringing society towards a collectively brighter day; even if it's just one project at time.")),






          React.createElement("div", {
              className: "title"
            },
            React.createElement("h3", null, "\"The cake is a lie.\""),
            React.createElement("p", {
              className: "separator"
            })),

          React.createElement("div", {
              className: "desc"
            },
            React.createElement("h4", {
              className: "subtitle"
            }, "Good leaders ask the right questions."),
            React.createElement("p", null, "I often find myself in leadership positions. Sometimes, due to me starting my own projects, dissatisfied with the options offered to me by others— and sometimes, helping others to pursue a noble goal."),
            React.createElement("p", null, "This makes me ask myself. What makes a good leader? What does a leader bring to the team? And then I realize. Good leaders ask the right questions."),


            React.createElement("p", null, "One could compare them to a miner piercing a gemstone— revealing a dazzling result within. And, I think, that’s how you do it. The team, the thoughts, and the ideas are scattered. Humans aren’t good at multitasking— so asking a question funnels those ideas down."),


            React.createElement("p", null, "You repeat the process. And suddenly— ding! You have your answer.")),




          React.createElement("div", {
              className: "desc"
            },
            React.createElement("h4", {
              className: "subtitle"
            }, "Learning to learn quickly."),
            React.createElement("p", null, "Hand me any tool, check back in on me in a short amount of time, and I will be pumping out a working product. That is my guarantee. "),

            React.createElement("p", null, "Funnily enough, I like to think of software engineering as a translation job. An english psuedo-code (or Japanese, if that is your flavor), broken up into its’ smallest parts, and then tediously churned into lines of code. Swapping out the grinder you use is the easiest part."),

            React.createElement("p", null, "However, it’s not just code I have an affinity for. It’s anything you might need. Need a user interface designed in photoshop? Done. Need a video trailer completed in After Effects? Done. Need to tediously go through Excel? MySQL? AutoCAD? I'll get it done. We live in the information age, and I will make full use of it to educate myself.")





          ),


          React.createElement("div", {
              className: "desc full"
            },
            React.createElement("h4", {
              className: "subtitle"
            }, "SKILLS"),
            React.createElement("p", {
              className: "skills-list"
            }, "I've been doing full-stack development for about ten years. Here's a brief look at a few of my skills."),

            React.createElement("u1", {
                className: "skills"
              },

              React.createElement("li", {
                className: "skill",
                arialabel: "elite"
              }, "Python"),
              React.createElement("li", {
                className: "skill",
                arialabel: "elite"
              }, "C# (.NET)"),
              React.createElement("li", {
                className: "skill",
                arialabel: "pro"
              }, "Virtual Reality"),
              React.createElement("li", {
                className: "skill",
                arialabel: "advanced"
              }, "Unity"),
              React.createElement("li", {
                className: "skill",
                arialabel: "elite"
              }, "Unreal Engine"),
              React.createElement("li", {
                className: "skill",
                arialabel: "pro"
              }, "Source Engine"),
              React.createElement("li", {
                className: "skill",
                arialabel: "elite"
              }, "C++"),
              React.createElement("li", {
                className: "skill",
                arialabel: "advanced"
              }, "React & Node.js, Web Dev"),
              React.createElement("li", {
                className: "skill",
                arialabel: "pro"
              }, "LUA"),
              React.createElement("li", {
                className: "skill",
                arialabel: "elite"
              }, "Adobe Suite"),
              React.createElement("li", {
                className: "skill",
                arialabel: "elite"
              }, "Content Production"),
              React.createElement("li", {
                className: "skill",
                arialabel: "elite"
              }, "Management")

            ),

          ),

        ))));








};


/***********************
     Project Component
    ***********************/

var Project = function Project(props) {
  var tech = {
    sass: 'fab fa-sass',
    css: 'fab fa-css3-alt',
    js: 'fab fa-js-square',
    react: 'fab fa-react',
    vue: 'fab fa-vuejs',
    video: 'fas fa-file-video',
    d3: 'far fa-chart-bar',
    node: 'fab fa-node',
    award: 'fas fa-award',
    code: 'fas fa-code',
    people: 'fas fa-users',
    php: 'fab fa-php',
    linux: 'fab fa-linux',
    map: 'fas fa-map',
    hammer: 'fas fa-gavel',
    windows: 'fab fa-windows',
    mic: 'fas fa-microphone-alt',
    html: 'fab fa-html5',
    python: 'fab fa-python',
    math: 'fas fa-calculator',
    money: 'fas fa-dollar-sign',
    server: 'fas fa-server',
    game: 'fas fa-gamepad'
  };

  var techtooltips = {
    sass: 'SASS',
    css: 'CSS3',
    js: 'JavaScript',
    react: 'React',
    vue: 'Vue',
    video: 'Content Production',
    d3: 'D3',
    node: 'NodeJS',
    award: 'Award-Winning',
    code: 'Development',
    people: 'Community',
    php: 'PHP',
    linux: 'Linux OS',
    map: 'Level Design',
    hammer: 'Content Creation',
    windows: 'Windows OS',
    mic: 'Audio Production',
    html: 'HTML5',
    python: 'Python',
    math: 'Mathematics',
    money: 'Business',
    server: 'Dedicated Servers',
    game: 'Games'
  };


  var link = props.link || 'http://';
  var repo = props.repo || 'http://';
  var lname = props.lname || '2nd Link';

  return (
    React.createElement("div", {
        className: "project"
      },
      React.createElement("a", {
          className: "project-link",
          href: link,
          target: "_blank",
          rel: "noopener noreferrer"
        },
        React.createElement("img", {
          className: "project-image",
          src: props.img,
          alt: 'Screenshot of ' + props.title
        })),

      React.createElement("div", {
          className: "project-details"
        },
        React.createElement("div", {
            className: "project-tile"
          },
          React.createElement("p", {
              className: "icons"
            },
            props.tech.split(' ').map(function (t) {
              return (
                React.createElement("span", {
                    className: "tooltip",
                    datatooltip: techtooltips[t]
                  },
                  React.createElement("i", {
                    className: tech[t],
                    key: t
                  })));
            })),


          props.title, ' '),

        props.children,
        React.createElement("div", {
            className: "buttons"
          },

          React.createElement("a", {
              href: link,
              target: "_blank",
              rel: "noopener noreferrer"
            }, "Link ",
            React.createElement("i", {
              className: "fas fa-external-link-alt"
            })),
          React.createElement("a", {
              href: repo,
              target: "_blank",
              rel: "noopener noreferrer"
            }, lname + " ",
            React.createElement("i", {
              className: "fas fa-external-link-alt"
            }))
        ))));





};



/***********************
     Projects Component
    ***********************/

var Projects = function Projects(props) {
  return (
    React.createElement("section", {
        id: "projects"
      },
      React.createElement("div", {
          className: "projects-container"
        },
        React.createElement("div", {
            className: "heading"
          },
          React.createElement("h3", {
            className: "title"
          }, "\"You've met with a terrible fate, haven't you?\""),
          React.createElement("p", {
            className: "separator"
          }),
          React.createElement("p", {
              className: "subtitle"
            }, "Here's a touchover of ",
            React.createElement("u", null, "some"), " of the projects and activites I've dabbled with. Grab",
            ' ',
            React.createElement("a", {
              href: "documents/resumes.html",
              target: "_blank",
              rel: "noopener noreferrer"
            }, "one of my complete resumes here"), " to see a more complete list of the things I've done!")),


        React.createElement("div", {
            className: "projects-wrapper"
          },
          React.createElement(Project, {
            title: "Unreal Engine Developer for NexTechAR",
            img: 'images/nextechar.jpg',
            tech: "code people money game server windows",
            link: "https://www.nextechar.com/",
            lname: "Inferno",
            repo: "https://www.nextechar.com/inferno"
          },	  
		  React.createElement("small", null, "Architecting a web-based MVP in Unreal Engine 4 for virtual events."),
          React.createElement("p", null, "Utilizing the latest version of Unreal Engine 4, I was able to implement live-pixel streaming in the browser, allowing us to render high-fidelity 3D experiences on remote AWS instances, and stream them to our end clients. Along with this, I designed and created UI in UMG, as well as worked with Node.js webservers to configure them for HTTPS and SSL. Currently, I am designing a system that will allow for dynamic map generation based on data input from Inferno.")),
          
		  
          React.createElement(Project, {
            title: "Senior Game Developer for Jeep",
            img: 'images/jeep.jpg',
            tech: "code people money game server windows",
            link: "https://www.jeep.com/wagoneer.html/",
            lname: "Demo Video",
            repo: "https://youtu.be/LRI4KjdAvh8"
          },
          React.createElement("small", null, "Creating a browser-based experience for the 2021 Jeep Wagoneer."),
          React.createElement("p", null, "Working with a 3rd party studio working with Jeep, I architected all of the interactible features and controls for our car showcase and demo, originally intended for CES 2021, but now with a larger scope. This demo allows you to see the look and features of the new 2021 Jeep Wagoneer. Along with this, I created an AR companion app for iOS and Android, that allows you to view the vehicle in AR.")),
          
          React.createElement(Project, {
            title: "Lead VR Engineer for DMG Entertainment",
            img: 'images/dmg-entertainment.jpg',
            tech: "code people money game server windows",
            link: "https://www.dmg-entertainment.com/live-entertainment/transformers-vr-center/",
            lname: "News Article",
            repo: "https://deadline.com/2017/05/hasbro-dmg-virtual-reality-transformers-centers-china-1202100512/"
          },
          React.createElement("small", null, "Shipping two location-based immersive VR titles for the Transformers IPO in Shanghai, China."),
          React.createElement("p", null, "After coming into the company, I took over complete engineering responsibilities for two different immersive VR projects originally developed by different teams at two third-party studios. From there, I worked with artists to try to ship these two products, flying on-site to Shanghai, China to whip both the hardware and software into a shippable state. Intensive and fast development cycles based around on-site Q&A, which eventually included the development and maintenance of a live service after soft-opening for our FEC was approved. Currently in the process of development of new attractions, along with versions two and three of existing ones.")),
          
          React.createElement(Project, {
              title: "Divinity Servers.",
              img: 'images/AnonMsgBoard.jpg',
              tech: "people money server js css php html linux windows",
              link: "https://divinityservers.com/client/aff.php?aff=5",
              lname: "Hostpicker",
              repo: "https://hostpicker.net/companies/divinity-servers"
            },

            React.createElement("small", null, "A server-hosting company started owned by and me and a partner."),


            React.createElement("p", null, "A long time running company, Divinity Servers sells virtual private servers, game servers, web hosting, and an assortment of other products at a monthly fee. Creating this with another has allowed me to learn an assortment of skills-- particularly managing the backend of a company and its' customers, and making sure that everything is a smooth experience for them on both the website, and our server platforms.")),




          React.createElement(Project, {
              title: "Winner of Hack for Savannah.",
              img: 'images/StockPriceChecker.jpg',
              tech: "award money html js css",
              link: "https://hackforsavannah.org/",
              lname: "News Article",
              repo: "https://goo.gl/f5U35x"
            },

            React.createElement("small", null, "A 2017 group hackathon competition for improving city resiliency post-hurricane."),


            React.createElement("p", null, "Quoting the Savannah Morning News, \"Working alone, Everett Hinton received a special award for “best turnkey” project, a web site called Savannah Storm Info that included a crowd sourcing feature to create maps of storm impacts as well as post-storm openings and closings. CEMA Director Dennis Jones loved the web site saying he could see implementing it immediately.\"")),




          React.createElement(Project, {
              title: "1st Place Winner of TechFest 2018.",
              img: 'images/PersonalLibrary.jpg',
              tech: "award money game code",
              link: "https://www.armstrong.edu/academic-departments/cs-it-techfest",
              lname: "News Article",
              repo: "https://theinkwellonline.com/2018/04/11/techfest-2018/"
            },

            React.createElement("small", null, "A tech-based contest hosted in 2018 by ACM at AASU for both graduate and undergraduate students."),
            React.createElement("p", null, "During my time at Armstrong State, I attended an ACM contest and presented my research on a new locomotion technique for virtual reality dubbed \"Radial Locomotion\" and achieved first place. This new technique used multi-variable calculus and an assortment of other concepts to allow for infinite movement space in VR without any extra equipment required, converting linear motion to radial motion.")),




          React.createElement(Project, {
              title: "Novabox.",
              img: 'images/IssueTracker.jpg',
              tech: "game people map server code html php js",
              link: "https://steamcommunity.com/groups/novabox",
              lname: "Dev Vlogs",
              repo: "http://goo.gl/bs9adh"
            },

            React.createElement("small", null, "A gaming company centered around community interaction. Managed, coded, and designed by me."),
            React.createElement("p", null, "Beginning in 2014, one of my largest passion projects was directing a non-profit roleplaying game community. This included hiring staff, designing and managing a website; setting up game servers, as well as designing and shipping the code that went on them-- and making sure the players had a fun and easy experience. Along with this, I implemented a lot of my own level designs into the game we used, which allowed for more creative freedom.")),





          React.createElement(Project, {
              title: "Elliptical Curves over Finite Fields.",
              img: 'images/Cortala.jpg',
              tech: "people code python math",
              link: "https://mathduc.com/hilbert-class-polynomials/",
              lname: "CoCalc",
              repo: "https://cocalc.com/projects/64cc74b3-5f61-4e1e-a783-d7402dfa820d"
            },

            React.createElement("small", null, "A year of mathematics undergraduate research at AASU with Doctor Duc Huynh."),
            React.createElement("p", null, "Being one of three undergraduate students in the United States to do research in this field, we used SAGE and Python to code (and complete) a working implementation of a primality test utilizing hilbert class polynomials and elliptical curves; we even presented our project at a mathematics conference at GA Southern! Working under Dr. Huynh allowed me to learn not just how to conduct mathematics research for any idea that came to mind-- but also how to attend group conferences, and how to manage a busy schedule around multiple people when research needs to get done.")),


          React.createElement(Project, {
              title: "Freelance & Contract Developer.",
              img: 'images/ChoroplethMap.jpg',
              tech: "money people code php game server",
              link: "https://steamcommunity.com/id/dremekek/",
              lname: "Github",
              repo: "https://github.com/Kemerd"
            },

            React.createElement("small", null, "Extensive amounts of private, for-comission based projects."),
            React.createElement("p", null, "I have been coding for 10 years; practically to the point where I live and breathe coding. After 2013, I began putting my skills to use, managing an extensive clientelle base of customers who hired me on the basis of temporary comissions and for-contract work. The type of work varied in anything from website creation, to game-server development, to even to being a technical lead.")),

			
			/*
          React.createElement(Project, {
              title: "First Robotics.",
              img: 'images/ExerciseTracker.jpg',
              tech: "people hammer code",
              link: "https://hvjrobotics.weebly.com/",
              lname: "FIRST",
              repo: "https://www.firstinspires.org/robotics/frc"
            },

            React.createElement("small", null, "Team member of HVJenkin's FIRST Robotics Team, 4701, as well as being an engineering program student."),
            React.createElement("p", null, "Although I only attended this program for two years as a freshman and sophomore, I consider the robotics team close to my character; as it taught me how to manage a boss, deadlines, and working with others on an actual physical project. Even more than anything, it taught me how to seperate the workload, and how to make sure there's no time being wasted; and that when you're at work-- you're dedicating yourself to the project. We attended group robot competitions in Atlanta, GA.")),
			*/



          React.createElement(Project, {
              title: "Source Engine Level Design.",
              img: 'images/BarChart.jpg',
              tech: "code map hammer",
              link: "https://steamcommunity.com/id/dremekek/myworkshopfiles/",
              lname: "Dev Vlogs",
              repo: "https://goo.gl/oRMDYh"
            },

            React.createElement("small", null, "Utilizing Visual Studio C++, Hammer Editor, and build and shipping tools for level editing and design."),
            React.createElement("p", null, "Despite it being aged now, a personal favorite of mine is Valve's Source Engine. It was one of the very first 3D engines I picked up way back in 2013, and I've been designing and shipping levels for it ever since. Aside from using Source SDK 2013, I've also used Garrysmod as an base for running my levels. In particular, this came in handy whilst working public maps which I released for Novabox, as it shares an engine. A lot of my work was done in trying to find creative methods to push an old engine to the very brink of its' capabilities, to deliver the best possible end-result.")),

          React.createElement(Project, {
              title: "Ragger.",
              img: 'images/TreemapDiagram.jpg',
              tech: "game hammer code",
              link: "https://youtu.be/7-w-FhIe7L8",
              lname: "Dev Vlogs",
              repo: "https://youtu.be/7-w-FhIe7L8"
            },

            React.createElement("small", null, "A 2019 portal-inspired puzzle platformer-esque game in which you ragdoll yourself to complete puzzles."),
            React.createElement("p", null, "After messing around with a debug feature that allowed me to ragdoll my character in Unreal Engine 4, I realized I was having a lot of fun doing nothing, just watching my character faceplant. So what if I designed levels and puzzles around this mechanic? That's what I ended up doing, and I'm trying to design a multitude of fun and engaging levels (along with a hint of storyline here and there), for a late 2019 release. Coding done in Blueprint and C#.")),

		
		/*
          React.createElement(Project, {
              title: "Undergraduate Student.",
              img: 'images/QuotingMachine.jpg',
              tech: "math code money",
              link: "https://www.usc.edu/",
              lname: "Physics",
              repo: "https://dornsife.usc.edu/physics/"
            },

            React.createElement("small", null, "Pursuing an undergraduate degree in Physics & Computer Science."),
            React.createElement("p", null, "One of my proudest achievements as a low-income first generation independent, is getting into the University of Southern California as a Physics & CS student. Something I've always said is that Physics is the closest I'm ever get to being a wizard; and it really does feel like magic! Engineering and physics is like game development, but in real life; and if I've been doing game development for nine years, there's bound to be some way I can integrate my skills into a more real and profound effect! Along with this, I've also been studying Japanese for a year, with plans to study abroad.")),
		*/
		
          React.createElement(Project, {
              title: "Condemned.",
              img: 'images/Condemned.jpg',
              tech: "game hammer code server video",
              link: "https://goo.gl/cwZGcC",
              lname: "Facepunch",
              repo: "https://goo.gl/Bi1i4u"
            },

            React.createElement("small", null, "A nutscript based serious roleplaying schema set in a post zombie-outbreak earth."),
            React.createElement("p", null, "Running off of the Source Engine & Garrysmod, I created a fully-fledged, at least to the best of my abilities, a zombie survival gamemode set in a post-apocalyptic earth. This included designing the levels for said earth, coding the interface and features for the game into Nutscript, as well as managing the community behind it. The link below brings you to a YouTube playlist with a handful of the features!")),
		
		/*
          React.createElement(Project, {
              title: "Overvoice.",
              img: 'images/overvoice.jpg',
              tech: "people mic video",
              link: "https://discord.gg/9437JsW",
              lname: "Discord",
              repo: "https://discord.gg/9437JsW"
            },

            React.createElement("small", null, "A medium-sized Discord-based voice acting community hub."),
            React.createElement("p", null, "Originally starting as a coalition and meeting place for Overwatch character impersonators, it has quickly become a meeting place for voice actors, YouTubers, singers, and even cosplayers to get together and find the right person for their project needs. Currently, it fluctates anywhere from 850 to 950 members. I created this for fun, and as such the community is rather relaxed in its' rules; however it is still, in my opinion, a safe and great place to comingle!")),
		*/
		
          React.createElement(Project, {
              title: "Eclipse 2D MMORPG Engine.",
              img: 'images/TomateTimer.jpg',
              tech: "code map hammer",
              link: "https://www.eclipseorigins.com/",
              lname: "Profile",
              repo: "https://www.eclipseorigins.com/user/kemerd"
            },

            React.createElement("small", null, "A 2D engine that utilizes Visual Basic 6 and DirectX8 to create a multiplayer RPG template."),
            React.createElement("p", null, "After playing Final Fantasy 5 as a child, I instantly had the urge to create my own. Learning to code through reading Wikipedia documentation on my Wii, once I got a computer under my fingers, this was my first introduction into not only the world of coding, but also game development. Through this, I've worked with the engine from 2009 to around 2013, when I felt ready to make the jump from 2D to 3D development and design.")),
			
			/*
          React.createElement(Project, {
              title: "Unity.",
              img: 'images/TicTacToe.jpg',
              tech: "game hammer code map",
              link: "https://unity3d.com/",
              lname: "Unity",
              repo: "https://unity3d.com/"
            },

            React.createElement("small", null, "Utilizing Unity's level design tools, UnityScript, and C# to make projects."),
            React.createElement("p", null, "One of the first engines I tried out in 2013 after my decision to go 3D was Unity. I worked in it for about half a year before switching to Unreal Engine and eventually Source Engine (and back to Unreal when UE4 came out) as my engine of choice. However, I've used it on and off over the last six years for an assortment of pet projects, as well as assisting others' with their projects when and if they need help, as Unity seems to be tool of choice agmonst undergraduate classes.")),




          React.createElement(Project, {
              title: "Unreal Engine.",
              img: 'images/Twitch.jpg',
              tech: "game hammer code map",
              lname: "Forums",
              link: "https://www.unrealengine.com/",
              repo: "https://forums.unrealengine.com/"
            },


            React.createElement("small", null, "Using Unreal Engine 4's design tools, C#, and BluePrint to ship research and games."),
            React.createElement("p", null, "My first experience with Unreal was Unreal Engine 3 back in (again) 2013. Sort of clunky and not easy to use, I ended up shying away. However, as my skill improved, my taste for something a bit more versatile and \"clean\" arose. Unreal Engine 4 appealed to me not only in that it didn't have the overhead that Unity had, but the lighting was phenominal. The tools, although technically more advanced than Unity, were almost ten times more versatile. It quickly became a favorite, and it is what I use to test new Virtual Reality functions, as well as what I will be using to ship my games in the future.")),

		


          React.createElement(Project, {
              title: "Music.",
              img: 'images/WeatherApp.jpg',
              tech: "mic video",
              link: "https://soundcloud.com/kemerd/sets/freestyle-music",
              lname: "Soundcloud",
              repo: "https://soundcloud.com/kemerd/sets/freestyle-music-two"
            },


            React.createElement("small", null, "Singing, guitar, bass, and piano."),
            React.createElement("p", null, "Deep in my heart, music is very important to me. I may be heavily involved in STEM, but I still smile a bit when people are surprised I tell them I'm not a full-time musician. However, I believe it is very important to have outlets. Life is very hard, and without music to relieve my stress-- keep me grounded, and help me deflate; I not only don't think I would be where I am today, but I don't think I could continue doing the things I'm able to do. When I'm not busy, I find myself playing whenever I can. Sometimes that means every day, and sometimes it means, at minimum, once a week.")),

          React.createElement(Project, {
              title: "Voice acting.",
              img: 'images/MetricImperialConverter.jpg',
              tech: "mic video",
              link: "https://www.youtube.com/c/Dremekeks",
              lname: "Soundcloud",
              repo: "https://soundcloud.com/kemerd/sets/voice-acting"
            },

            React.createElement("small", null, "The art of using my voice to make others smile."),
            React.createElement("p", null, "Accents have always been a favorite thing of mine to practice; and one day, I realized this could transfer over to impressions of famous characters.. and eventually led to me mastering my own, independent voice. I ended up creating a YouTube to share some of the shenanigins that I get into, and people seem to like it! Beware, my content is geared towards entertaining adults, so some language may be explicit. However, it's not just my YouTube I've done voice acting both for money, and for free, for others' projects!")),
		*/
		
          React.createElement(Project, {
              title: "Your project",
              img: 'images/Documentify.jpg',
              tech: "people money",
              link: "#",
              lname: "Your Project",
              repo: "#"
            },

            React.createElement("small", null, "Whatever you need done, my best is guaranteed."),
            React.createElement("p", null, "Spin me up, point me in a direction, and I'll start chugging along. Want to add your project to this list as something for us both to be proud of? Feel free to contact me via email down below. I look forward to working with you!"))))));







};



/***********************
     Contact Component
    ***********************/

var Contact = function Contact(props) {
  return (
    React.createElement("section", {
        id: "contact"
      },
      React.createElement("div", {
          className: "container"
        },
        React.createElement("div", {
            className: "heading-wrapper"
          },
          React.createElement("div", {
              className: "heading"
            },
            React.createElement("p", {
                className: "title"
              }, "Want to ",
              React.createElement("br", null), "contact me?"),


            React.createElement("p", {
              className: "separator"
            }),
            React.createElement("p", {
                className: "subtitle"
              }, "Please call or text (323) 546-6375 or send an email to ",
              '',
              React.createElement("span", {
                  className: "mail"
                }, "dehinton",

                React.createElement("i", {
                  className: "fas fa-at at"
                }), "usc",

                React.createElement("i", {
                  className: "fas fa-circle dot"
                }), "edu"), ":")),





          React.createElement(SocialLinks, null)),

        React.createElement("form", {
            id: "contact-form",
            action: "#"
          },
          React.createElement("input", {
            placeholder: "Name",
            name: "name",
            type: "text",
            required: true
          }),
          React.createElement("input", {
            placeholder: "Email",
            name: "email",
            type: "email",
            required: true
          }),
          React.createElement("textarea", {
            placeholder: "Message",
            type: "text",
            name: "message"
          }),
          React.createElement("span", {
            className: "mail"
          }, "Notice: This feature is broken currently, please send an email manually."),
          React.createElement("input", {
            className: "button",
            id: "submit",
            value: "N/A",
            type: "submit"
          })))));




};



/***********************
     Footer Component
    ***********************/

var Footer = function Footer(props) {
  return (
    React.createElement("footer", null,
      React.createElement("div", {
          className: "wrapper"
        },
        React.createElement("h3", null, "THANKS FOR VISITING"),
        React.createElement("p", null, "\xA9 ", new Date().getFullYear(), " D Everett Hinton."),
        React.createElement(SocialLinks, null))));



};




/***********************
     Social Links Component
    ***********************/

var SocialLinks = function SocialLinks(props) {
  return (
    React.createElement("div", {
        className: "social"
      },
      React.createElement("a", {
          href: "https://twitter.com/Dremekek",
          target: "_blank",
          rel: "noopener noreferrer",
          title: "Link to author's Twitter profile"
        },

        ' ',
        React.createElement("i", {
          className: "fab fa-twitter"
        })),

      React.createElement("a", {
          id: "profile-link",
          href: "https://www.linkedin.com/in/d-everett-hinton-214116181/",
          target: "_blank",
          rel: "noopener noreferrer",
          title: "Link to author's LinkedIn Profile"
        },

        ' ',
        React.createElement("i", {
          className: "fab fa-linkedin-in"
        })),

      React.createElement("a", {
          id: "profile-link",
          href: "https://github.com/Kemerd",
          target: "_blank",
          rel: "noopener noreferrer",
          title: "Link to author's GitHub Profile"
        },

        ' ',
        React.createElement("i", {
          className: "fab fa-github"
        })),

      React.createElement("a", {
          href: "https://www.youtube.com/user/Dino10or/",
          target: "_blank",
          rel: "noopener noreferrer",
          title: "Link to author's Development YouTube"
        },

        ' ',
        React.createElement("i", {
          className: "fab fa-youtube"
        }))));



};



/***********************
     Main Component
    ***********************/
var

  App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App() {
      var _ref;
      var _temp, _this, _ret;
      _classCallCheck(this, App);
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = App.__proto__ || Object.getPrototypeOf(App)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
          menuState: false
        }, _this.


        toggleMenu = function () {
          _this.setState(function (state) {
            return {
              menuState: !state.menuState ?
                'active' : state.menuState === 'deactive' ?
                'active' : 'deactive'
            };
          });

        }, _temp), _possibleConstructorReturn(_this, _ret);
    }
    _createClass(App, [{
      key: "render",
      value: function render()

      {
        return (
          React.createElement(React.Fragment, null,
            React.createElement(Menu, {
              toggleMenu: this.toggleMenu,
              showMenu: this.state.menuState
            }),
            React.createElement(Nav, {
              toggleMenu: this.toggleMenu,
              showMenu: this.state.menuState
            }),
            React.createElement(Header, null),
            React.createElement(About, null),
            React.createElement(Projects, null),
            React.createElement(Contact, null),
            React.createElement(Footer, null)));


      }
    }, {
      key: "componentDidMount",
      value: function componentDidMount()

      {
        var navbar = document.querySelector('#navbar');
        var header = document.querySelector('#welcome-section');
        var forest = document.querySelector('.forest');
        var silhouette = document.querySelector('.silhouette');
        var forestInitPos = -300;

        window.onscroll = function () {
          var scrollPos = document.documentElement.scrollTop || document.body.scrollTop;

          if (scrollPos <= window.innerHeight) {
            silhouette.style.bottom = parseInt(scrollPos / 6) + "px";
            forest.style.bottom = parseInt(forestInitPos + scrollPos / 6) + "px";
          }

          if (scrollPos - 100 <= window.innerHeight)
            header.style.visibility = header.style.visibility === 'hidden' && 'visible';
          else
            header.style.visibility = 'hidden';

          if (scrollPos + 100 >= window.innerHeight) navbar.classList.add('bg-active');
          else
            navbar.classList.remove('bg-active');
        };

        (function navSmoothScrolling() {
          var internalLinks = document.querySelectorAll('a[href^="#"]');
          var _loop = function _loop(
            i) {
            if (internalLinks.hasOwnProperty(i)) {
              internalLinks[i].addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(internalLinks[i].hash).scrollIntoView({
                  block: 'start',
                  behavior: 'smooth'
                });

              });
            }
          };
          for (var i in internalLinks) {
            _loop(i);
          }
        })();
      }
    }]);
    return App;
  }(React.Component);



ReactDOM.render(React.createElement(App, null), document.getElementById('app'));