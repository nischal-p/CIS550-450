import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default class PageNavbar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            navDivs: [],
        };
    }

    componentDidMount() {
        const pageList = [
            "mypage",
            "search",
            "recommendations",
            "genres",
            "bestsongs",
        ];

        let navbarDivs = pageList.map((page, i) => {
            if (this.props.active === page) {
                return (
                    <a
                        className="nav-item nav-link active"
                        key={i}
                        href={"/" + page}
                    >
                        {page.charAt(0).toUpperCase() +
                            page.substring(1, page.length)}
                    </a>
                );
            } else {
                return (
                    <a className="nav-item nav-link" key={i} href={"/" + page}>
                        {page.charAt(0).toUpperCase() +
                            page.substring(1, page.length)}
                    </a>
                );
            }
        });

        this.setState({
            navDivs: navbarDivs,
        });
    }

    render() {
        return (
            <header className="PageNavbar">
                <nav className="navbar navbar-expand-lg shadow navbar-light bg-light">
                    <span className="navbar-brand center">
                        <h3 className="brand-on-navbar">ExploreMusic</h3>
                    </span>
                    <div
                        className="collapse navbar-collapse"
                        id="navbarNavAltMarkup"
                    >
                        <div className="navbar-nav">{this.state.navDivs}</div>
                    </div>
                </nav>
            </header>
        );
    }
}
