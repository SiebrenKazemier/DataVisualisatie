import pandas as pd
import matplotlib.pyplot as plt
import json

# loads the datafile
df = pd.read_csv('input.csv')


# Rename columns
df.rename(columns={"Country": "country",
                   "Region": "region",
                   "Pop. Density (per sq. mi.)": "pop_density",
                   "Infant mortality (per 1000 births)": "infant_mortality",
                   "GDP ($ per capita) dollars": "gdp_in_dollars"}, inplace=True)

# selects the needed columns
df = df[['country', 'region', 'pop_density',
         'infant_mortality', 'gdp_in_dollars']]


# cleaning database
# change ',' to '.'
df.pop_density = df.pop_density.str.replace(',', '.')
df.infant_mortality = df.infant_mortality.str.replace(',', '.')
# remove dollars
df.gdp_in_dollars = df.gdp_in_dollars.str.replace('dollars', '')
# remove whitespace
df.country = df.country.str.rstrip()
df.region = df.region.str.strip()


# remove false data
df = df[df != 'Suriname']

# remove NaN and unknown
df = df[df != 'unknown']
df = df.dropna()


# change data type to float or int
columns = ['pop_density', 'infant_mortality', 'gdp_in_dollars']
for column in columns:
    df[column] = pd.to_numeric(df[column])

# histogram of the gdp in dollars
df.hist(column='gdp_in_dollars', bins=len(
    df['gdp_in_dollars'].unique()), grid=False, figsize=(8, 5), color='#86bf91', rwidth=0.5)
plt.xlabel('GDP in dollars per capita')
plt.ylabel('Aantal')
plt.title('GDP amount')
plt.show()

# boxplot infant_mortality
plt.boxplot(df['infant_mortality'])
plt.title('Infant mortality')
plt.ylabel('mortality per 1000 births')
plt.show()

# print the gdp data
print("values for gdp in dollars are:")
print(f"Mean: {df['gdp_in_dollars'].mean()}")
print(f"Median: {df['gdp_in_dollars'].median()}")
print(f"Mode: {df['gdp_in_dollars'].mode()[0]}")

# print the infant mortality data
plot_data = plt.boxplot(df['infant_mortality'])
quartile_list = [item.get_ydata()[0] for item in plot_data['whiskers']]
min_max_list = [item.get_ydata()[1] for item in plot_data['whiskers']]

print("The Five Number Summary of the Infant Mortality data is:")
print(f"min: {min_max_list[0]}")
print(f"max: {min_max_list[1]}")
print(f"25%: {quartile_list[0]}")
print(f"50%: {df['infant_mortality'].describe()[5]}")
print(f"75%: {quartile_list[1]}")

# create .json file
df = df.to_json(orient='records')

with open('data.json', 'w') as fp:
    json.dump(df, fp)

data = json.loads(df)

# prints json file
# print(json.dumps(data, indent=4))
