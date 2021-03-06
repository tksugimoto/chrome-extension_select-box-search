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
			searchBox.addEventListener("focus", () => {
				this.targetSelectBox.size = 10;
			});
			searchBox.addEventListener("blur", () => {
				window.setTimeout(() => {
					// blurと同時にsize=1にすると選択できないため
					this.targetSelectBox.size = 1;
				}, 500);
			});

			searchBoxContainer.appendChild(searchBox);

			this.targetSelectBox.parentNode.insertBefore(searchBoxContainer, this.targetSelectBox);
		}
	}

	document.querySelectorAll("select").forEach(selectBox => {
		new SelectBoxFilter(selectBox);
	});

	// 要素の動的挿入に対応
	{
		const target = document.body;
		const config = {
			childList: true,
			subtree: true
		};
		const observer = new MutationObserver(mutations => {
			stop();
			mutations.forEach(mutation => {
				mutation.addedNodes.forEach(addedNode => {
					if (addedNode.tagName === "SELECT") {
						new SelectBoxFilter(addedNode);
					} else {
						if (!addedNode.querySelectorAll) return;
						addedNode.querySelectorAll("select").forEach(selectBox => {
							new SelectBoxFilter(selectBox);
						});
					}
				});
			});
			start();
		});
		const start = () => {
			observer.observe(target, config);
		};
		const stop = () => {
			observer.disconnect();
		};
		start();
	}
}
