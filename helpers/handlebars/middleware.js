const url = require('url');

const makeActive = (items, currentUrl) => {
    return items.map(item => {
        const regex = new RegExp("^" + item.link, "i");

        if (currentUrl.replace(regex, '') === '') {
            item.class = 'active';
            item.childActive = true;
        } else if(currentUrl.match(regex)) {
            item.class = 'child-active';
            item.childActive = true;
        }

        if(item.children) {
            makeActive(item.children, currentUrl);
        }

        return item;
    });
};

module.exports = (req, res, next) => {
    // TODO: based on permissions

    res.locals.sidebarItems = [{
        name: 'Übersicht',
        icon: 'th-large',
        link: '/dashboard/',
    }, {
        name: 'Kurse',
        icon: 'graduation-cap',
        link: '/courses/'
    }, {
        name: 'Termine',
        icon: 'table',
        link: '/calendar/'
    }, {
        name: 'Dateien',
        icon: 'folder-open',
        link: '/files/'
    }, {
        name: 'Materialien',
        icon: 'search',
        link: '/content/'
    }];

    res.locals.sidebarItems.push({
        name: 'Administration',
        icon: 'cogs',
        link: '/administration/',
        permission: 'ADMIN_VIEW',
        children: [
            {
                name: 'Kurse',
                link: '/administration/courses/'
            },
            {
                name: 'Klassen',
                link: '/administration/classes/'
            },
            {
                name: 'Lehrer',
                link: '/administration/teachers/'
            },
            {
                name: 'Schüler',
                link: '/administration/students/'
            }
        ]
    });

     makeActive(res.locals.sidebarItems, url.parse(req.url).pathname);

    next();
};