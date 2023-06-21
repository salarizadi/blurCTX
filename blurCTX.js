/**
 *  Copyright (c) 2023
 *  @Version    : 1.0.0
 *  @Repository : https://github.com/salarizadi/blurCTX
 *  @Author     : https://salarizadi.github.io
 *
 * const ctxItems = [
 *   {
 *     content: `Item 1`,
 *     events: {
 *       click: (e) => console.log(e, "Item 1 Clicked")
 *     }
 *   },
 *   { content: `Item 2` },
 *   { content: `Item 3` },
 *   { content: `Item 4` },
 *   {
 *     content: `Item 5`,
 *     divider: "top" // top, bottom, top-bottom
 *   }
 * ];
 *
 * 3. Attach the context menu to the target element.
 *
 * const ctx = new CTX({
 *   target    : ".item", // $(".item")
 *   mode      : "light", // Dark & Light
 *   menuItems : ctxItems
 * });
 *
 * 4. Initialize the context menu. Done.
 *
 * ctx.init();
 */

class blurCTX {
    constructor ( {
       target = null,
       menuItems = [],
       mode = "dark"
    } ) {
        this.target = target;
        this.menuItems = menuItems;
        this.mode = mode;
        this.targetNode = this.getTargetNode();
        this.menuItemsNode = this.getMenuItemsNode();
        this.isOpened = false;
    }

    getTargetNode ( ) {
        const nodes = $(this.target);

        if (nodes && nodes.length !== 0) {
            return nodes;
        } else {
            console.error(`getTargetNode :: "${this.target}" target not found`);
            return [];
        }
    }

    getMenuItemsNode ( ) {
        const nodes = [];

        if (!this.menuItems) {
            console.error("getMenuItemsNode :: Please enter menu items");
            return [];
        }

        this.menuItems.forEach((data, index) => {
            const item = this.createItemMarkup(data);
            item.firstChild.setAttribute(
                "style",
                `animation-delay: ${index * 0.08}s`
            );
            nodes.push(item);
        });

        return nodes;
    }

    createItemMarkup ( data ) {
        const button = document.createElement("BUTTON");
        const item = document.createElement("LI");

        button.innerHTML = data.content;
        button.classList.add("contextMenu-button");
        item.classList.add("contextMenu-item");

        if (data.divider) item.setAttribute("data-divider", data.divider);
        item.appendChild(button);

        if (data.events && data.events.length !== 0) {
            Object.entries(data.events).forEach((event) => {
                const [key, value] = event;
                button.addEventListener(key, value);
            });
        }

        return item;
    }

    renderMenu ( ) {
        const menuContainer = $("<ul>");

        menuContainer.addClass("contextMenu");
        menuContainer.attr("data-theme", this.mode);

        this.menuItemsNode.forEach((item) => menuContainer.append(item));

        return menuContainer;
    }

    closeMenu ( menu ) {
        if (this.isOpened) {
            this.isOpened = false;
            menu.remove();
        }
    }

    init ( ) {
        let contextMenu = this.renderMenu();
        document.addEventListener("click", () => this.closeMenu(contextMenu));
        window.addEventListener("blur", () => this.closeMenu(contextMenu));

        const $This = this;

        this.targetNode.each(function () {
            $(this).bind("contextmenu", e => {
                e.preventDefault();
                $(`.contextMenu`).remove();

                $This.isOpened = true;

                const {clientX, clientY} = e;
                $(`body`).append(contextMenu);

                contextMenu = $(".contextMenu");

                let positionY = 0, positionX = 0;
                if (typeof contextMenu[0] !== "undefined") {
                    contextMenu = contextMenu[0];
                    positionY =
                        clientY + contextMenu.scrollHeight >= window.innerHeight
                            ? window.innerHeight - contextMenu.scrollHeight - 20
                            : clientY;
                    positionX =
                        clientX + contextMenu.scrollWidth >= window.innerWidth
                            ? window.innerWidth - contextMenu.scrollWidth - 20
                            : clientX;
                }

                $(contextMenu).attr(
                    "style", `--width: ${contextMenu.scrollWidth}px;--height: ${contextMenu.scrollHeight}px;--top: ${positionY}px;--left: ${positionX}px`
                );
            });
        });
    }
}
