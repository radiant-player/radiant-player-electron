{
    "targets": [
        {
            "target_name": "addon",
            "sources": ["lib/addon.cc", "lib/mouse.cc"],
            "link_settings": {
                "libraries": [
                    "/System/Library/Frameworks/ApplicationServices.framework"
                ]
            },
            "include_dirs": [
                "<!(node -e \"require('nan')\")"
            ]
        }
    ]
}
