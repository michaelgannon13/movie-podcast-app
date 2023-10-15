import 'bootstrap/dist/css/bootstrap.min.css';

function Nav() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top w-100">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Payroc Podcast Inspiration App</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
   
      </div>
    </nav>
  );
}

export default Nav;
