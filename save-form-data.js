(function (global, factory) {

    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = factory();
    } else {
        global.SaveFormData = factory();
    }

})(typeof window !== "undefined" ? window : this, function () {

    function SaveFormData(options) {

        var defaults = {
            form_selector: '',
            storage_key: null,
            auto_restore: true,
            auto_save: true
        };

        var settings = Object.assign({}, defaults, options);

        var form = document.querySelector(settings.form_selector);

        if (!form) {
            console.error("SaveFormData: form not found");
            return;
        }

        var storageKey = settings.storage_key || 'SaveFormData_' + settings.form_selector;

        function save() {

            var data = {};

            form.querySelectorAll("input, select, textarea").forEach(function (field) {

                if (!field.name) return;

                if (field.type === "radio") {

                    if (field.checked)
                        data[field.name] = field.value;

                }
                else if (field.type === "checkbox") {

                    if (!data[field.name]) data[field.name] = [];

                    if (field.checked)
                        data[field.name].push(field.value);

                }
                else {

                    data[field.name] = field.value;

                }

            });

            localStorage.setItem(storageKey, JSON.stringify(data));

        }

        function restore() {

            var saved = localStorage.getItem(storageKey);

            if (!saved) return;

            var data = JSON.parse(saved);

            Object.keys(data).forEach(function (name) {

                var fields = form.querySelectorAll('[name="' + name + '"]');

                fields.forEach(function (field) {

                    if (field.type === "radio" || field.type === "checkbox") {

                        if (Array.isArray(data[name])) {
                            field.checked = data[name].includes(field.value);
                        } else {
                            field.checked = field.value === data[name];
                        }

                    }
                    else {

                        field.value = data[name];

                    }

                });

            });

        }

        function clear() {
            localStorage.removeItem(storageKey);
        }

        function reset() {
            clear();
            form.reset();
        }

        if (settings.auto_restore) restore();

        if (settings.auto_save) {
            form.addEventListener("input", save);
            form.addEventListener("change", save);
        }

        return {
            save,
            restore,
            clear,
            reset
        };

    }

    return SaveFormData;

});