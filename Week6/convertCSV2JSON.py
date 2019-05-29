###############################################################################
# Name: Siebren Kazemier
# Student number: 12516597
# School: Uva
# Project: Assignment week 4, Converting CSV file to JSON
###############################################################################

import pandas as pd

# csv_file = read_csv("voorraad_woningen.csv", sep=";")


def main(input_file, output_file):

    csv_file = read_csv(input_file)
    json_file = write_json(csv_file, output_file)


def read_csv(input_file):
    csv_file = pd.read_csv(input_file, sep=";")
    csv_file = parseData(csv_file)
    return csv_file


def parseData(csv_file):
    # strip file from extra notations
    csv_file.regio = csv_file.regio.str.rstrip("(PV)")
    csv_file.regio = csv_file.regio.str.rstrip()
    csv_file.perioden = csv_file.perioden.str.rstrip("*")
    # change province names
    csv_file.regio = csv_file.regio.str.replace("Groningen", "NL.GR")
    csv_file.regio = csv_file.regio.str.replace("Friesland", "NL.FR")
    csv_file.regio = csv_file.regio.str.replace("Drenthe", "NL.DR")
    csv_file.regio = csv_file.regio.str.replace("Overijssel", "NL.OV")
    csv_file.regio = csv_file.regio.str.replace("Gelderland", "NL.GE")
    csv_file.regio = csv_file.regio.str.replace("Utrecht", "NL.UT")
    csv_file.regio = csv_file.regio.str.replace("Noord-Holland", "NL.NH")
    csv_file.regio = csv_file.regio.str.replace("Zeeland", "NL.ZE")
    csv_file.regio = csv_file.regio.str.replace("Noord-Brabant", "NL.NB")
    csv_file.regio = csv_file.regio.str.replace("Limburg", "NL.LI")
    csv_file.regio = csv_file.regio.str.replace("Flevoland", "NL.FL")
    csv_file.regio = csv_file.regio.str.replace("Zuid-Holland", "NL.ZH")
    # remove general information
    csv_file = csv_file.dropna()

    # selects the needed columns
    csv_file = csv_file[["perioden", "regio", "beginstandVoorraad",
                         "nieuwbouw", "overigeToevoeging", "sloop",
                         "overigeOnttrekking", "correctie", "saldoVoorraad",
                         "eindstandVoorraad"]]

    return csv_file


def write_json(csv_file, output_file):
    json_file = csv_file.to_json(path_or_buf=output_file, orient="split")
    return json_file


if __name__ == "__main__":
    main("voorraad_woningen.csv", "voorraad_woningen.json")
