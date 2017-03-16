require('../styles/files.scss');
import Directories from './directories';

class Files extends React.Component {

	constructor(props) {
		super(props);

		this.state = { };
	}

	getStorageTitle(storageContext) {
		var values = storageContext.split("/");
		switch (values[0]) {
			case 'users':
				let dirName = values.filter((v, index) => {
					return index > 1;
				}).join("/");
				return `Meine persönlichen Dateien /${dirName}`;
			case 'courses': return "Kurs-Dateien";
			case 'classes': return "Klassen-Dateien";
			default: return "";
		}
	}
    preventEventPropagation(e){
        if (!e) var e = window.event;
        e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation();
	}

	handleOnDownloadClick(file,e) {
       this.preventEventPropagation(e)
		this.props.actions.download(file, this.props.storageContext);
	}

	handleOnDeleteClick(file) {
		this.props.actions.delete(file, this.props.storageContext).then(res => {
			this.props.onReload(this.props.storageContext);
		});
	}

	handleOnOpenClick(file){
        return this.props.actions.open(file, this.props.storageContext);
	}

	getFileDeleteModalUI(file) {
		return (
			<div className="modal fade" id={`deleteFileModal${file.id}`} role="dialog" aria-labelledby="myModalLabel">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-label="Close"><span
								aria-hidden="true">&times;</span></button>
							<h4 className="modal-title" id="myModalLabel">Datei löschen</h4>
						</div>
						<div className="modal-body">
							<p>Möchtest du die Datei wirklich löschen?</p>
							<span>
								<button type="button" className="btn btn-default" data-dismiss="modal" aria-label="Close">
									Abbrechen
								</button>
								<button onClick={this.handleOnDeleteClick.bind(this, file)} type="button" className="btn btn-primary" data-dismiss="modal" aria-label="Close">
									Löschen
								</button>
							</span>
						</div>
					</div>
				</div>
			</div>
		);
	}

    writeFileSizePretty(filesize) {
		var unit;
		var iterator = 0;

        while (filesize > 1024) {
            filesize = Math.round((filesize/1024) * 100) / 100;
            iterator++;
        }
        switch (iterator){
			case 0:
				unit = "B";
                break;
			case 1:
				unit = "KB";
                break;
            case 2:
                unit = "MB";
                break;
            case 3:
                unit = "GB";
                break;
            case 4:
                unit = "TB";
                break;
		}
		return (filesize + unit);
	}

	getFileUI(file) {
		return (
			<div className="col-sm-6 col-xs-12 col-md-4" key={`file${file.id}`}>
				<div className="card file"
					 onMouseOut={function() {$("."+file.id).hide()}}
					 onMouseOver={function() {$("."+file.id).show()}}>
					<div className="openFile"  onClick={this.handleOnOpenClick.bind(this, file)}>
					<div className="card-block">
						<div className="card-title">
							<div className="col-sm-3 no-padding">
								<div className="file-preview" style={{'background-image': 'url(' + file.thumbnail + ')'}}></div>
							</div>
							<large>{file.name}</large>
							<div className={file.id} style={{"display": "none"}}>
								Änderungsdatum: {file.lastModified}
                                Ort: {file.path}
								Art: {file.type}
								Größe: {this.writeFileSizePretty(file.size)}
							</div>
						</div>
						<div className="card-text">
							<i className="fa fa-cloud-download" aria-hidden="true" onClick={this.handleOnDownloadClick.bind(this, file)}/>
							<i className="fa fa-trash-o" aria-hidden="true" data-toggle="modal" data-target={`#deleteFileModal${file.id}`} onClick={this.preventEventPropagation}/>
						</div>
						</div>
					</div>
				</div>
				{ this.getFileDeleteModalUI(file) }
			</div>
		);
	}

	getFilesUI() {
        var used = 0;
		return (
			<div>
				{this.props.files.map((file) => {
                    used += parseInt(file.size);
                    return this.getFileUI(file);
				})}
				{this.writeFileSizePretty(used)}
			</div>
		);
	}

	getStorageContextUI() {
		return (
			<h5>
				{this.getStorageTitle(this.props.storageContext)}
			</h5>
		);
	}

	render() {
		return (
			<section className="files">
				<div className="container-fluid">
					<div className="row">
						<div className="col-sm-12 no-padding">
							{console.log(this)}
							{this.getStorageContextUI()}
						</div>
					</div>
					<Directories {...this.props} />
					<div className="row">
						<div className="row">
							{this.getFilesUI()}
						</div>
					</div>
				</div>
			</section>
		);
	}

}

export default Files;
