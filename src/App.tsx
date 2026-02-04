import { useState } from 'react';
import './App.css';

function App() {
  const [navOpen, setNavOpen] = useState(false);

  const toggleNav = () => {
    setNavOpen(!navOpen);
  };

  const closeNav = () => {
    setNavOpen(false);
  };

  return (
    <div className={navOpen ? 'nav-open' : ''}>
      <header>
        <div className="logo">
          <img src="/img/logo.png" alt="The owners name: Ali Banihashemi" className="logo__img" />
        </div>
        <button className="nav-toggle" aria-label="toggle navigation" onClick={toggleNav}>
          <span className="hamburger"></span>
        </button>
        <nav className="nav">
          <ul className="nav__list">
            <li className="nav__item"><a href="#home" className="nav__link" onClick={closeNav}>Home</a></li>
            <li className="nav__item"><a href="#services" className="nav__link" onClick={closeNav}>My Services</a></li>
            <li className="nav__item"><a href="#about" className="nav__link" onClick={closeNav}>About me</a></li>
            <li className="nav__item"><a href="#work" className="nav__link" onClick={closeNav}>My Work</a></li>
          </ul>
        </nav>
      </header>

      {/* Introduction */}
      <section className="intro" id="home">
        <h1 className="section__title section__title--intro">
          Hi, I am <strong>Ali Banihashemi</strong>
        </h1>
        <img src="/img/park.jpg" className="intro__img" alt="Ali in the park" />
        <p className="section__subtitle section__subtitle--intro">researcher & front-end dev</p>
      </section>

      {/* My services */}
      <section className="my-services" id="services">
        <h2 className="section__title section__title--services">What I do</h2>
        <div className="services">
          <div className="service">
            <h3>Design + Development</h3>
            <p>Hello! I'm Ali, a junior React developer with a passion for building intuitive, responsive, and efficient web applications. While I'm still in the early stages of my professional journey, I pride myself on my strong foundation in JavaScript and my dedication to continuous learning in the ever-evolving world of web development.</p>
          </div>
          <div className="service">
            <h3>Modeler</h3>
            <p>Using <strong>Python</strong>, I specialize in agent-based modeling (ABM). This powerful language has enabled me to intertwine complex systems with tangible business challenges. My simulations, crafted through Python, encapsulate the nuances of multifaceted phenomena, offering profound insights.</p>
          </div>
          <div className="service">
            <h3>Researcher</h3>
            <p>I'm, a passionate <a href="https://www.aau.at/blog/sind-entscheidungen-besser-wenn-sie-von-vielen-getroffen-werden/" className="phd">researcher</a>. Venturing beyond the traditional boundaries of business research, my work dives deep into the captivating realm of 'Open Strategy'. My approach is not just theoretical; it is deeply rooted in Computational Social Science, a fusion that offers nuanced and technologically-driven insights into the intricate world of strategic management.</p>
          </div>
        </div>
        <a href="#work" className="btn">My Work</a>
      </section>

      {/* About me */}
      <section className="about-me" id="about">
        <h2 className="section__title section__title--about">Who I am</h2>
        <p className="section__subtitle section__subtitle--about">Designer & developer based out of NYC</p>

        <div className="about-me__body">
          <p>
            Welcome to my portfolio! I'm Ali Banihashemi, a Ph.D. student in Business Administration at the University of Klagenfurt. With a Bachelor's in Electronics and a Master's in Business Administration, I blend technical expertise with business insights.
          </p>
          <p>
            Python is my go-to for research, and I love using React to create beautiful, reactive web pages. Explore my projects that showcase my passion for technology and business. Let's make a positive impact together! Feel free to connect.
          </p>
        </div>

        <img src="/img/profile.jpg" alt="Ali in park" className="about-me__img" />
      </section>

      {/* My Work */}
      <section className="my-work" id="work">
        <h2 className="section__title section__title--work">My work</h2>
        <p className="section__subtitle section__subtitle--work">A selection of my range of work</p>

        <div className="portfolio">
          {/* Portfolio item 01 */}
          <a href="#" className="portfolio__item">
            <img src="/img/agent.JPG" alt="" className="portfolio__img" />
          </a>

          {/* Portfolio item 02 */}
          <a href="#" className="portfolio__item">
            <img src="/img/calculator.jpg" alt="" className="portfolio__img" />
          </a>

          {/* Portfolio item 03 */}
          <a href="#" className="portfolio__item">
            <img src="/img/openstrategy.jpg" alt="" className="portfolio__img" />
          </a>

          {/* Portfolio item 04 */}
          <a href="#" className="portfolio__item">
            <img src="/img/openstrategy.png" alt="" className="portfolio__img" />
          </a>

           {/* Portfolio item 05 */}
           <a href="#" className="portfolio__item">
            <img src="/img/strategy.jpg" alt="" className="portfolio__img" />
          </a>
          
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="mail_and_phone">
          <a href="mailto:salibanihashemie@gmail.com" className="footer__link">salibanihashemie@gmail.com</a>
        </div>
        <div>
          <a href="tel:+4367764373262" className="footer__link">+43 677 64373262<span className="phone-link">+43 677 64373262</span></a>
        </div>
        <ul className="social-list">
          <li className="social-list__item">
            <a className="social-list__link" href="https://linkedin.com/in/ali-banihashemi-1a193324a">
              <i className="fab fa-linkedin"></i>
            </a>
          </li>
          <li className="social-list__item">
            <a className="social-list__link" href="https://github.com/alibanihashemi">
              <i className="fab fa-github"></i>
            </a>
          </li>
        </ul>
      </footer>
    </div>
  );
}

export default App;