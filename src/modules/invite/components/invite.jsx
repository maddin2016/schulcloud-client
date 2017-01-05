import Layout from '../../core/components/layout';

import {
	Checkbox,
	CheckboxGroup,
	Icon,
	Input,
	RadioGroup,
	Row,
	Select,
	File,
	Textarea,
	ReactSelect,
	Form,
	validators
} from '../../core/helpers/form';

require('../styles/invite.scss');

class Invite extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Layout className="route-signup">
				<div className="container">
					<div className="row">
						<div className="col-md-6 offset-md-3">
							<h1>Willkommen zur<br />Schul-Cloud</h1>

							<p>Im <b>ersten Schritt</b> würden wir Sie gerne besser kennen lernen:</p>

							<Form>
								<div className="row">
									<div className="col-md-6">
										<Input
											label="Vorname"
											name="firstName"
											type="text"
											layout="vertical"
											required
										/>
									</div>
									<div className="col-md-6">
										<Input
											label="Nachname"
											name="lastName"
											type="text"
											layout="vertical"
											required
										/>
									</div>
								</div>

								<div className="row">
									<div className="col-md-12">
										<Input
											label="E-Mail"
											name="email"
											type="email"
											validations="isEmail"
											validationError="This is not an email"
											layout="vertical"
											required
										/>
									</div>
								</div>

								<div className="row">
									<div className="col-md-12">
										<Input
											label="Passwort"
											name="password"
											type="password"
											layout="vertical"
											validations={{
												matchRegexp: validators.password
											}}
											validationError="Ihr Passwort stimmt nicht mit den Anforderungen überein"
											required
										/>
										<p className="text-muted">Ihr Passwort muss folgendes enthalten:</p>
										<ul className="text-muted">
											<li>Mindestens 8 Zeichen</li>
											<li>Groß- und Kleinschreibung</li>
											<li>Mindestens eine Zahl und Sonderzeichen</li>
										</ul>
									</div>
								</div>

								<div className="row">
									<div className="col-md-12">
										<Input
											label="Passwort bestätigen"
											name="password2"
											type="password"
											layout="vertical"
											validations="equalsField:password"
											validationError="Ihr Passwort ist ungleich"
											required
										/>
									</div>
								</div>

							</Form>

							<p>Sie erhalten von uns nach dem Abschluss Ihrer Registrierung
								eine E-Mail mit Ihren Benutzernamen.</p>
							<hr />

							<button className="btn btn-success">Anmelden</button>
						</div>
					</div>
				</div>
			</Layout>
		);
	}

}

export default Invite;
