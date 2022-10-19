.DEFAULT_GOAL := help

###############################################################
## ------------------------------------------------------------
## Helpful commands for managing meepo bot and database.
## ------------------------------------------------------------
###############################################################

.PHONY: help ## : Show this help.
help:
	@sed -ne '/@sed/!s/## //p' $(MAKEFILE_LIST)

.PHONY: kill ## : Kill/restart the container.
kill:
	kill 1