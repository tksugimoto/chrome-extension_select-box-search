{

	const attributeName = `data-is-readied-${chrome.runtime.id}`;

	class SelectBoxFilter {
		constructor(targetSelectBox) {
			if (!targetSelectBox || targetSelectBox.tagName !== "SELECT") throw new TypeError("targetSelectBoxは<select>である必要があります");
			if (targetSelectBox.hasAttribute(attributeName)) return;
			targetSelectBox.setAttribute(attributeName, "true");
			this.targetSelectBox = targetSelectBox;
			this.createDataIndex();
			this.createSearchBox();
			targetSelectBox.size = 5;
		}

		createDataIndex() {
			const options = this.targetSelectBox.getElementsByTagName("option");
			this.options = Array.from(options).map(option => {
				const text = option.textContent.toUpperCase();
				return {
					element: option,
					text: text
				};
			});
		}

		createSearchBox() {
			const searchBoxContainer = document.createElement("div");
			const searchBox = document.createElement("input");
			searchBox.placeholder = "検索";
			searchBox.style.width = "100%";
			searchBox.addEventListener("keyup", () => {
				// スペースで区切られていたら＆検索にする
				const queries = searchBox.value.toUpperCase().split(/[ 　]+/).filter(s => s !== "");
				this.options.forEach(({element, text}) => {
					element.style.display = element.selected || queries.every(query => {
						return text.includes(query);
					}) ? "" : "none";
				});
			});

			searchBoxContainer.appendChild(searchBox);

			this.targetSelectBox.parentNode.insertBefore(searchBoxContainer, this.targetSelectBox);
		}
	}

	document.querySelectorAll("select").forEach(selectBox => {
		new SelectBoxFilter(selectBox);
	});

}
