.DEFAULT_GOAL := help

###############################################################
## ------------------------------------------------------------
## Helpful commands for managing meepo bot and database.
## ------------------------------------------------------------
###############################################################

.PHONY: help ## : Show this help.
help:
	@sed -ne '/@sed/!s/## //p' $(MAKEFILE_LIST)

.PHONY: commands ## : Re-deploy discord bot commands.
commands:
	node deployCommands.js

.PHONY: shop ## : Update tables (CAUTION: will update quantity).
shop:
	node dbInit.js

.PHONY: reset_shop ## : Empty and re-make tables (CAUTION: will drop tables).
reset_shop:
	node dbInit.js --force

.PHONY: kill ## : Kill/restart the container.
kill:
	kill 1

.PHONY: quiz ## : Creates quiz in channel within config.
quiz:
	node quizInit.js