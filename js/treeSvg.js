export class SvgArea {
	constructor(width, height) {
		this.width = width;
		this.height = height; 
	}

	creeatSvgTree(){
		let tree = d3.layout.tree()
                     .size([this.height - 40, this.width - 80]);
        return tree;
	}

	loadJsonFiel(){
		let promise = new Promise(function(resolve, reject)){
			d3.json(name, function (error, root)){
				if(error !== undefine)
					reject();
				else
					resolve(root);
			});
		});
		
		return promise;
	}

}