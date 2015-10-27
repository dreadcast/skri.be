import local from './local';

export default function(Writenode){
	let { addService } = Writenode;

	return addService('medias/local', local);
}
