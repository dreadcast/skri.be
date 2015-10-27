import images from './images';

export default function(Writenode){
	let { addService } = Writenode;

	return addService('medias/local/images', images);
}
